export class DateFilterUtil {
    static createDateFilter(availableDates: Date[]): (date: Date | null) => boolean {
        return (date: Date | null): boolean => {
            if (!date) return false;

            const dateStr = date.toDateString();
            return availableDates.some(availableDate =>
                availableDate.toDateString() === dateStr
            );
        };
    }

    static createDateClass(availableDates: Date[]): (date: Date) => string {
        return (date: Date): string => {
            const dateStr = date.toDateString();
            const isAvailable = availableDates.some(availableDate =>
                availableDate.toDateString() === dateStr
            );
            return isAvailable ? 'available-date' : '';
        };
    }

    static isDateAvailable(date: Date, availableDates: Date[]): boolean {
        const dateStr = date.toDateString();
        return availableDates.some(availableDate =>
            availableDate.toDateString() === dateStr
        );
    }
}