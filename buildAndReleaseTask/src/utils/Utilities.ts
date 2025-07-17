export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

const removeDuplicates = <T>(list: Array<T>): Array<T> => [...new Set(list)];

export const ensureValue = <T>(value: T | null | undefined, propertyName: string): T => {
  if (isNil(value)) throw new Error(`'${propertyName}' is required for task execution.`);
  return value;
};

export const mapToCliArguments = (
  parameters: Record<string, string | string[] | number | boolean | null | undefined>,
): string => {
  return Object.entries(parameters)
    .filter(([, value]) => !isNil(value))
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? `--${key}` : "";
      } else {
        return `--${key}="${value}"`;
      }
    })
    .join(" ");
};

export const ensureValueIsOneOf = <T extends string>(
  options: Array<T>,
  value: string | undefined,
  opts: { caseSensitive?: boolean } = {},
): T | undefined => {
  if (value === undefined) return undefined;
  const match = options.find((option) => {
    return opts.caseSensitive
      ? option === value
      : option.toLocaleLowerCase() === value.toLocaleLowerCase();
  });
  if (!isNil(match)) return match;
  throw new Error(`Invalid enum value '${value}'. Valid options are: ${options.join(", ")}.`);
};

export const ensureEnumValue = <
  T extends string,
  TEnumObject extends Record<string, T> = Record<string, T>,
>(
  enumObject: TEnumObject,
  value: string | undefined,
): T | undefined => {
  const options = Object.values(enumObject).filter((o) => o !== "Unknown"); // exclude the usual default value
  return ensureValueIsOneOf(options, value);
};

export const obfuscateProperties = <T extends Record<string, unknown> = Record<string, unknown>>(
  dictionary: T,
  properties: Array<keyof T>,
  replacement = "*********",
) => {
  return Object.entries(dictionary).reduce<T>((accumulator, [key, value]) => {
    return {
      ...accumulator,
      [key]: properties.includes(key) ? replacement : value,
    };
  }, {} as T);
};

export const getExcludeDirectories = (excludedDirectoriesInput: Array<string>): Array<string> => {
  const defaultExcludedDirectories = [
    "**/node_modules/**",
    "**/bin/**",
    "**/obj/**",
    "**/lib/**",
    "**/soos/**",
  ];
  const cleansedInput = excludedDirectoriesInput.map((pattern) => pattern.trim());
  return cleansedInput.length > 0 ? removeDuplicates(cleansedInput) : defaultExcludedDirectories;
};
