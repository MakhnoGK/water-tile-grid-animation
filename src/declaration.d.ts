declare module '*.module.scss' {
    interface ClassNames {
        [className: string]: string;
    }

    const className: ClassNames;
    export = className;
}

