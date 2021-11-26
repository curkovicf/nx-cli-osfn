export declare namespace OsUtils {
    enum Platform {
        windows = 0,
        unix = 1,
        other = 2
    }
    function getOs(): Platform;
    function getPlatformPathSeparator(): string;
    function parsePath(path: string): string;
}
//# sourceMappingURL=os-utils.namespace.d.ts.map