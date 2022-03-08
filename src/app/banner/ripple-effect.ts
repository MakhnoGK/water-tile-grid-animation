/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable no-useless-escape */
import { LinearFilter, Mesh, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, Texture, TextureLoader, WebGLRenderer } from 'three';
import { isMobile } from 'react-device-detect';
import gsap from 'gsap';

import vertex from './shaders/vert.glsl';
import fragment from './shaders/frag.glsl';

type TEasing =
    | 'Expo.none'
    | 'Expo.easeOut'
    | 'Expo.power1'
    | 'Expo.power2'
    | 'Expo.power3'
    | 'Expo.power4'
    | 'Expo.back'
    | 'Expo.elastic'
    | 'Expo.bounce'
    | 'Expo.rough'
    | 'Expo.slow'
    | 'Expo.steps'
    | 'Expo.circ'
    | 'Expo.expo'
    | 'Expo.sine';

interface IRippleEffectOptions {
    parent: HTMLElement;
    texture: string;
    intensity?: number;
    strength?: number;
    area?: number;
    waveSpeed?: number;
    speedIn?: number;
    speedOut?: number;
    easing?: TEasing;
    hover?: boolean;
}

class RippleEffect {
    private _time = 0;
    private _mouseOver = 0;
    private _playHead = RippleEffect.rand(1, 2);
    private _parent: HTMLElement;
    private _intensity: number;
    private _strength: number;
    private _area: number;
    private _waveSpeed: number;
    private _speedIn: number;
    private _speedOut: number;
    private _texture?: Texture;
    private _hover: boolean;
    private _easing: TEasing;
    private _renderer?: WebGLRenderer;
    private _material: ShaderMaterial;
    private _scene: Scene;
    private _camera: OrthographicCamera;
    
    constructor(opts: IRippleEffectOptions) {
        this._parent = opts.parent;
        this._intensity = opts.intensity || 1;
        this._strength = opts.strength || 2;
        this._area = opts.area || 6;
        this._waveSpeed = opts.waveSpeed || 0.01;
        this._speedIn = opts.speedIn || 1.4;
        this._speedOut = opts.speedOut || 1.2;
        this._hover = !opts.hover ? true : opts.hover;
        this._easing = opts.easing || 'Expo.easeOut';

        this._scene = new Scene();
        this._camera = new OrthographicCamera(
            this._parent.offsetWidth / -2,
            this._parent.offsetWidth / 2,
            this._parent.offsetHeight / 2,
            this._parent.offsetHeight / -2,
            1,
            1000
        );
        this._camera.position.z = 1;

        this._material = new ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                image: { value: this._texture },
                mouseOver: { value: this._mouseOver },
                intensity: { value: this._intensity * this._playHead },
                strength: { value: this._strength * this._playHead },
                area: { value: this._area * this._playHead },
                waveSpeed: { value: this._waveSpeed * this._playHead }
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true
        });

        const geometry = new PlaneBufferGeometry(this._parent.offsetWidth, this._parent.offsetHeight, 1);
        const mesh = new Mesh(geometry, this._material);

        this._scene.add(mesh);

        if (this._hover) {
            this.setupEvents();
        }

        this.updateTexture(opts.texture);
    }

    private static rand (a: number, b: number) {
        return a + (b - a) * Math.random();
    }

    private startCallback = () => {
        gsap.to(this._material.uniforms.mouseOver, {
            duration: this._speedIn,
            value: 1,
            ease: this._easing,
            overwrite: true
        });
    }

    private endCallback = () => {
        gsap.to(this._material.uniforms.mouseOver, {
            duration: this._speedOut,
            value: 0,
            ease: this._easing
        });
    }

    private setupRenderer() {
        this._parent.innerHTML = '';

        this._renderer = new WebGLRenderer({
            antialias: false,
            alpha: true
        });

        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setClearColor(0xffffff, 0.0);
        this._renderer.setSize(this._parent.offsetWidth, this._parent.offsetHeight);

        this._parent.appendChild(this._renderer.domElement);
    }

    private setupEvents() {
        let evtIn = 'mouseenter';
        let evtOut = 'mouseleave';

        if (isMobile) {
            evtIn = 'touchstart';
            evtOut = 'touchend';
        }

        this._parent.addEventListener(evtIn, this.startCallback);

        this._parent.addEventListener(evtOut, this.endCallback);

        window.addEventListener('resize', () => {
            this._renderer?.setSize(this._parent.offsetWidth, this._parent.offsetHeight); 
        });
    }

    private updateTexture(textureSrc: string) {
        const loader = new TextureLoader();
        loader.crossOrigin = '';
        
        return new Promise<void>((resolve) => {
            loader.load(textureSrc, (texture) => {
                this._texture = texture;
                this._texture.minFilter = LinearFilter;
                this._material.uniforms.image.value = this._texture;
                this._material.needsUpdate = true;
                this._material.uniformsNeedUpdate = true;
                this.setupRenderer();
                this.animate();
                resolve();
            }, undefined, () => {
                // eslint-disable-next-line no-console
                console.warn('Banner: cannot load texture!');
            })
        });
    }

    private animate() {
        this._time += 1;

        this._material.uniforms.time.value = this._time;
        this._renderer?.render(this._scene, this._camera);

        requestAnimationFrame(this.animate.bind(this));
    }

    public start() {
        this.startCallback();
    }

    public stop() {
        this.endCallback();
    }

    public dispose () {
        this._renderer?.dispose();
        this._material.dispose();
        this._scene.children.forEach((child) => this._scene.remove(child));
        
        this._parent.removeEventListener('mouseenter', this.startCallback);
        this._parent.removeEventListener('mouseleave', this.endCallback);
        this._parent.removeEventListener('touchstart', this.startCallback);
        this._parent.removeEventListener('touchend', this.endCallback);
    }
}

export default RippleEffect;
