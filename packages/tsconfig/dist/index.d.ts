import { CreatePagesArgs, CreateSchemaCustomizationArgs } from 'gatsby';
interface PluginOptions {
    query: string;
    keys: string[];
    normalizer: (input: {
        data?: unknown;
        errors?: unknown;
    }) => Record<string, unknown>[];
}
export declare const createPages: (ctx: CreatePagesArgs, opts: PluginOptions) => Promise<void>;
export declare const createSchemaCustomization: (ctx: CreateSchemaCustomizationArgs) => Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map