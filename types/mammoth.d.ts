declare module "mammoth" {
  export default {
    convertToHtml(
      input: {
        path?: string;
        buffer?: Buffer;
      },
      options?: {}
    ): Promise<{ value: string; messages: string[] }>;,
  };
}
