export function pad2(input: number|string): string {
    return ('0' + String(input)).slice(-2);
}

export class ExtractedDate {

    year: number;
    month: number;
    date: number;

    constructor(year: number, month: number, date: number) {
        this.year = year;
        this.month = month;
        this.date = date;
    }

    toString(): string {
        return `${this.year}-${pad2(this.month + 1)}-${pad2(this.date)}`;
    }

    toDate(): Date {
        return new Date(this.year, this.month, this.date, 0, 0, 0);
    }
}

export class ExtractedTime {
    hours: number;
    minutes: number;
    seconds: number;

    constructor(hours: number, minutes: number, seconds: number) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    toString(): string {
        return `${pad2(this.hours)}:${pad2(this.minutes)}:${pad2(this.seconds)}`;
    }

    toDate(): Date {
        return new Date(1970, 0, 1, this.hours, this.minutes, this.seconds);
    }
}

export class ExtractedDateTime {
    year: number;
    month: number;
    date: number;
    hours: number;
    minutes: number;
    seconds: number;

    constructor(year: number, month: number, date: number, hours: number, minutes: number, seconds: number) {
        this.year = year;
        this.month = month;
        this.date = date;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    toString(): string {
        return `${this.year}-${pad2(this.month + 1)}-${pad2(this.date)} ${pad2(this.hours)}:${pad2(this.minutes)}:${pad2(this.seconds)}`;
    }

    toDate(): Date {
        return new Date(this.year, this.month, this.date, this.hours, this.minutes, this.seconds);
    }
}

export function extractDate(raw: string): ExtractedDate {
    const matched = raw.match(/^([0-9]{4})\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/);

    if (!matched) throw new Error(`Invalid date ${raw}`);

    const year = parseInt(matched[1]);
    const month = parseInt(matched[2]) - 1;
    const date = parseInt(matched[3]);

    return new ExtractedDate(year, month, date);
}

export function extractTime(raw: string): ExtractedTime {
    const matched = raw.match(/^([0-1][0-9]|2[0-3])\:([0-5][0-9])(?:\:([0-5][0-9]))?$/);

    if (!matched) throw new Error(`Invalid time ${raw}`);

    const hours = parseInt(matched[1]);
    const minutes = parseInt(matched[2]);
    const seconds = parseInt(matched[3] || '0');

    return new ExtractedTime(hours, minutes, seconds);
}

export function extractDateTime(raw: string): ExtractedDateTime {
	const matched = raw.match(/^([0-9]{4})\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) ([0-1][0-9]|2[0-3])\:([0-5][0-9])(?:\:([0-5][0-9]))?$/);

    if (!matched) throw new Error(`Invalid datetime ${raw}`);

    const year = parseInt(matched[1]);
    const month = parseInt(matched[2]) - 1;
    const date = parseInt(matched[3]);

	const hours = parseInt(matched[4]);
    const minutes = parseInt(matched[5]);
    const seconds = parseInt(matched[6] || '0');

    return new ExtractedDateTime(year, month, date, hours, minutes, seconds);
}