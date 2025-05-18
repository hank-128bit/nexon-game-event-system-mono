export class CustomRequestContext<Data extends Record<string, any> = Record<string, any>> {
  private readonly data: Data = {} as Data;

  public get<Key extends keyof Data>(key: Key): Data[Key] {
    return this.data[key];
  }

  public set<Key extends keyof Data>(key: Key, value: Data[Key]): void {
    this.data[key] = value;
  }

  public static createInstance<Data extends Record<string, any> = Record<string, any>>(): CustomRequestContext<Data> {
    return new CustomRequestContext<Data>();
  }
}
