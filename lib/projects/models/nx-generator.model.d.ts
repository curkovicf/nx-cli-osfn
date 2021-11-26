export interface NxGenerator {
    name: string;
    cmd: string;
    form: NxGeneratorForm;
}
export interface NxGeneratorForm {
    checkboxes: ICheckbox[];
    dropDowns: IDropdown[];
    textInputs: ITextInput[];
}
export declare function getNxGeneratorDir(nxGenerator: NxGenerator): string | undefined;
export declare function getNxGeneratorName(nxGenerator: NxGenerator): string | undefined;
export declare function getNxGeneratorFieldValue(nxGenerator: NxGenerator, field: string): string | undefined;
export declare enum FormType {
    text = 0,
    checkbox = 1,
    dropdown = 2
}
export interface BaseFormElement {
    title: string;
    placeholder: string;
    isRequired?: boolean;
}
export interface ICheckbox extends BaseFormElement {
    isChecked?: boolean;
}
export interface IDropdown extends BaseFormElement {
    items: string[];
    selectedItem?: string;
}
export interface ITextInput extends BaseFormElement {
    input?: string;
}
export declare enum SupportedNxPackages {
    angular = "@nrwl/angular",
    workspace = "@nrwl/workspace",
    electron = "nx-electron",
    flutter = "@nxrocks/nx-flutter",
    vue = "@nx-plus/vue",
    react = "@nrwl/react",
    nestjs = "@nrwl/nest",
    node = "@nrwl/node",
    svelte = "@nxext/svelte",
    web = "@nrwl/web"
}
export declare const supportedNxPackagesAsList: SupportedNxPackages[];
export declare function getNxGenerator(supportedNxGenerator: SupportedNxPackages): NxGenerator[];
/************************************************
 ************************************************
 ************ Angular Generators
 ************************************************
 ************************************************/
export declare const angularNxGenerators: NxGenerator[];
/************************************************
 ************************************************
 ************ React Generators
 ************************************************
 ************************************************/
export declare const reactNxGenerators: NxGenerator[];
//# sourceMappingURL=nx-generator.model.d.ts.map