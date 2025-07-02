type StringType = "lowerAlpha" | "upperAlpha" | "alpha" | "numbers" | "all";

type StringOptions = {
    type?: StringType | StringType[]; // Accept single or multiple types
    charset?: string; // Optional custom charset
};

type HashOption = "md5" | "sha1" | "sha256";

type GeneratorFunctionMap = {
  person: () => string;
  string: (length?: number, options?: StringOptions) => string;
  integer: (min?: number, max?: number) => number;
  float: (min?: number, max?: number, decimals?: number) => number;
  boolean: () => boolean;
  fileExtension: () => string;
  mimeType: () => string;
  date: (start?: Date, end?: Date) => string;
  time: () => string;
  dateTime: (start?: Date, end?: Date) => string;
  dateTimeISO: (start?: Date, end?: Date) => string;
  phone: (countryCode?: string) => string;
  telephone: (countryCode?: string) => string;
  email: () => string;
  url: () => string;
  uuid: () => string;
  color: () => string;
  hash: (type?: HashOption) => string;
};

type GeneratorKeys = keyof GeneratorFunctionMap;

type GeneratorArgs<K extends GeneratorKeys> = Parameters<GeneratorFunctionMap[K]>;
type GeneratorReturn<K extends GeneratorKeys> = ReturnType<GeneratorFunctionMap[K]>;

export class Random {
    private static charsetLower: string = "abcdefghijklmnopqrstuvwxyz";
    private static charsetUpper: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static charsetNumbers: string = "0123456789";

    private static charsetMap: Record<StringType, string> = {
        lowerAlpha: Random.charsetLower,
        upperAlpha: Random.charsetUpper,
        alpha: Random.charsetLower + Random.charsetUpper,
        numbers: Random.charsetNumbers,
        all: Random.charsetLower + Random.charsetUpper + Random.charsetNumbers,
    };

    private static names: string[] = [
        "Aarav", "Alice", "Bhavana", "Bob", "Charlie", "Chirag", "Deepa", "Diana", "Eshan", "Ethan", "Farhan", "Fiona",
        "Gauri", "George", "Hannah", "Harsh", "Ishita", "Jayesh", "John", "Kavita", "Lakshya", "Meera", "Nikhil", "Ojas",
        "Pranav", "Qasim", "Ritika", "Suresh", "Tanvi", "Uday", "Varsha", "Wasim", "Yamini", "Zoya"
    ];

    private static extensions: string[] = [
        ".txt", ".jpg", ".png", ".mp3", ".pdf", ".docx", ".xlsx", ".pptx", ".csv", ".json",
        ".xml", ".html", ".css", ".js", ".ts", ".mp4", ".zip", ".rar", ".gif", ".svg"
    ];

    private static mimeTypes: string[] = [
        "text/plain", "image/jpeg", "image/png", "audio/mpeg", "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/csv", "application/json", "application/xml", "text/html", "text/css",
        "application/javascript", "application/typescript", "video/mp4", "application/zip",
        "application/vnd.rar", "image/gif", "image/svg+xml"
    ];

    private static stdCodes: number[] = [
        11, 22, 33, 44, 20, 40, 79, 80, 120, 124, 129, 135, 141, 160, 161, 172, 175, 181, 183, 233, 240, 241, 250, 251, 253, 257, 260, 261, 265, 343, 413, 422, 431, 435, 452, 462, 469, 471, 474, 477, 478, 481, 483, 484, 485, 486, 487, 490, 495, 497, 512, 522, 532, 542, 551, 562, 581, 591, 621, 612, 641, 657, 712, 721, 724, 751, 761, 820, 821, 824, 831, 836, 863, 866, 870, 891, 3192, 4896
    ];

    private static pick<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static string(length: number = 10, options: StringOptions = {}): string {
        let charset = "";

        if (options.charset) {
            charset = options.charset;
        } else {
            let types: StringType[] = [];

            if (Array.isArray(options.type)) {
                types = options.type;
            } else if (options.type) {
                types = [options.type];
            } else {
                types = ["all"];
            }

            const charsetSet = new Set<string>();

            for (const type of types) {
                const chars = this.charsetMap[type] || "";
                chars.split("").forEach(c => charsetSet.add(c));
            }

            charset = Array.from(charsetSet).join("");
        }

        if (charset.length === 0) {
            throw new Error("Charset cannot be empty.");
        }

        return Array.from({ length }, () => this.pick(charset.split(""))).join("");
    }

    static person(): string {
        return this.pick(this.names);
    }

    static integer(min: number = 0, max: number = 100): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static float(min: number = 0, max: number = 100, decimals: number = 2): number {
        const rand = Math.random() * (max - min) + min;
        return parseFloat(rand.toFixed(decimals));
    }

    static boolean(): boolean {
        return Math.random() < 0.5;
    }

    static fileExtension(): string {
        return this.pick(this.extensions);
    }

    static mimeType(): string {
        return this.pick(this.mimeTypes);
    }

    static date(start: Date = new Date(2000, 0, 1), end: Date = new Date()): string {
        const timestamp = this.integer(start.getTime(), end.getTime());
        return new Date(timestamp).toISOString().split("T")[0];
    }

    static time(): string {
        const secondsInDay = 86400;
        const totalSeconds = this.integer(0, secondsInDay - 1);
        const hours = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, "0");
        const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    }

    static dateTimeISO(start: Date = new Date(2000, 0, 1), end: Date = new Date()): string {
        return new Date(this.integer(start.getTime(), end.getTime())).toISOString();
    }

    static dateTime(start: Date = new Date(2000, 0, 1), end: Date = new Date()): string {
        return this.dateTimeISO(start, end).replace(/T/, ' ').replace(/\.\d+Z$/, '');
    }

    static email(): string {
        return `${this.string(5)}@${this.string(5)}.com`;
    }

    static phone(countryCode: string = "+91"): string {
        const firstDigit = this.pick(["6", "7", "8", "9"]);
        const remainingDigits = Array.from({ length: 9 }, () => this.pick("0123456789".split(""))).join("");
        return `${countryCode}-${firstDigit}${remainingDigits}`;
    }

    static telephone(countryCode: string = "+91"): string {
        const stdCode = this.pick(this.stdCodes.map(String)); // Ensure it's a string
        const landlineLength = 10 - stdCode.length;

        if (landlineLength <= 0) {
            throw new Error(`Invalid STD code length: ${stdCode}`);
        }

        const landlineNumber = Array.from({ length: landlineLength }, () =>
            this.pick("0123456789".split(""))
        ).join("");

        return `${countryCode}-${stdCode}-${landlineNumber}`;
    }

    static url(): string {
        return `https://www.${this.string(8)}.com`;
    }

    static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static color(): string {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

    static hash(type: HashOption = "sha256"): string {
        let length: number;

        switch (type) {
            case "md5":
                length = 32;
                break;
            case "sha1":
                length = 40;
                break;
            case "sha256":
            default:
                length = 64;
                break;
        }

        return Array.from({ length }, () => this.pick("abcdef0123456789".split(""))).join("");
    }

    static uniqueValues<K extends GeneratorKeys>(
        count: number,
        generatorKey: K,
        args: GeneratorArgs<K> = [] as unknown as GeneratorArgs<K>
    ): GeneratorReturn<K>[] {
        if (typeof this[generatorKey] !== 'function') {
            throw new Error(`Undefined generator: ${generatorKey}`);
        }

        const seen = new Set<GeneratorReturn<K>>();
        const results: GeneratorReturn<K>[] = [];

        const generator = (this[generatorKey] as (...args: any[]) => GeneratorReturn<K>).bind(this);

        // Calculate max possible unique values for known finite sets
        let maxUnique = Infinity;
        if (generatorKey === 'person') maxUnique = this.names.length;
        if (generatorKey === 'fileExtension') maxUnique = this.extensions.length;
        if (generatorKey === 'mimeType') maxUnique = this.mimeTypes.length;

        if (count > maxUnique && maxUnique !== Infinity) {
            console.warn(`Requested ${count} unique values, but only ${maxUnique} unique values are possible. Returning ${maxUnique}.`);
        }

        const finalCount = Math.min(count, maxUnique);

        let attempts = 0;

        while (results.length < finalCount) {
            const value = generator(...args);
            if (!seen.has(value)) {
                seen.add(value);
                results.push(value);
            }

            attempts++;
            if (attempts > 10000) break; // Safety cap
        }

        return results.sort(() => Math.random() - 0.5);;
    }

    static fromArray<T>(array: T[]): T {
        if (array.length === 0) throw new Error("Array cannot be empty.");
        return this.pick(array);
    }

    static uniqueFromArray<T>(array: T[], count: number): T[] {
        if (array.length === 0) throw new Error("Array cannot be empty.");

        const maxUnique = Math.min(count, array.length);

        if (count > maxUnique) {
            console.warn(`Requested ${count} unique values, but only ${maxUnique} unique values are possible. Returning ${maxUnique}.`);
        }

        const shuffled = array.slice().sort(() => Math.random() - 0.5);

        return shuffled.slice(0, maxUnique);
    }
}
