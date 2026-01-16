export async function loadModule(filePath: string) {
  return import(filePath);
}
