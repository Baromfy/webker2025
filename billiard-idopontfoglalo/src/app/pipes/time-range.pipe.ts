import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeRange',
  standalone: true
})
export class TimeRangePipe implements PipeTransform {
  /**
   * Formats two Date objects into a human-readable time range string
   * 
   * @param startTime The start time
   * @param endTime The end time
   * @param options Optional formatting options
   * @returns Formatted time range string (e.g. "14:00 - 16:00")
   */
  transform(
    startTime: Date | null, 
    endTime: Date | null,
    options: { 
      showDate?: boolean, 
      dateFormat?: 'short' | 'medium' | 'long', 
      showDuration?: boolean 
    } = {}
  ): string {
    if (!startTime || !endTime) {
      return '';
    }

    const { showDate = false, dateFormat = 'short', showDuration = false } = options;
    
    // Format time with leading zeros
    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    };
    
    // Format date if needed
    const formatDate = (date: Date): string => {
      if (!showDate) return '';
      
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: dateFormat === 'short' ? '2-digit' : dateFormat === 'medium' ? 'short' : 'long', 
        day: '2-digit' 
      };
      
      return date.toLocaleDateString('hu-HU', options);
    };
    
    // Calculate duration if needed
    const getDuration = (): string => {
      if (!showDuration) return '';
      
      const diffMs = endTime.getTime() - startTime.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      const hourText = diffHours > 0 ? `${diffHours} óra` : '';
      const minuteText = diffMinutes > 0 ? `${diffMinutes} perc` : '';
      const separator = diffHours > 0 && diffMinutes > 0 ? ' ' : '';
      
      return `(${hourText}${separator}${minuteText})`;
    };
    
    const startDateFormatted = formatDate(startTime);
    const startTimeFormatted = formatTime(startTime);
    const endTimeFormatted = formatTime(endTime);
    const duration = getDuration();
    
    // Assemble the formatted string based on options
    let result = '';
    
    if (showDate) {
      result += `${startDateFormatted} `;
    }
    
    result += `${startTimeFormatted} - ${endTimeFormatted}`;
    
    if (showDuration) {
      result += ` ${duration}`;
    }
    
    return result;
  }
}
