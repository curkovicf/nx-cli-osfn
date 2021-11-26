export declare namespace NodeUtils {
    interface ExecuteCommandResponse {
        isSuccess: boolean;
        log: string;
    }
    function executeCommand(cmd: string, args: string[], pwd: string, successKeyword: string): Promise<ExecuteCommandResponse | null>;
    function spawnPromise(command: string, args: string[], path: string): Promise<string>;
}
//# sourceMappingURL=node-utils.namespace.d.ts.map