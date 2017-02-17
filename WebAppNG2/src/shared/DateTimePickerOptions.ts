
export interface DateTimePickerOptions
{
    /**
    *   String. Default: 'mm/dd/yyyy'
    *
    *   The date format, combination of p, P, h, hh, i, ii, s, ss, d, dd, m, mm, M, MM, yy, yyyy.
    *   p : meridian in lower case ('am' or 'pm') - according to locale file
    *   P : meridian in upper case ('AM' or 'PM') - according to locale file
    *   s : seconds without leading zeros
    *   ss : seconds, 2 digits with leading zeros
    *   i : minutes without leading zeros
    *   ii : minutes, 2 digits with leading zeros
    *   h : hour without leading zeros - 24-hour format
    *   hh : hour, 2 digits with leading zeros - 24-hour format
    *   H : hour without leading zeros - 12-hour format
    *   HH : hour, 2 digits with leading zeros - 12-hour format
    *   d : day of the month without leading zeros
    *   dd : day of the month, 2 digits with leading zeros
    *   m : numeric representation of month without leading zeros
    *   mm : numeric representation of the month, 2 digits with leading zeros
    *   M : short textual representation of a month, three letters
    *   MM : full textual representation of a month, such as January or March
    *   yy : two digit representation of a year
    *   yyyy : full numeric representation of a year, 4 digits     
    */
    format?: string;

    /**
    *  Integer. Default: 0
    *  Day of the week start. 0 (Sunday) to 6 (Saturday)
    */
    weekStart?: number;

    /**
    *  Date. Default: Beginning of time
    *  The earliest date that may be selected; all earlier dates will be disabled.
    */
    startDate?: number;

    /**
    *  Date. Default: End of time
    *  The latest date that may be selected; all later dates will be disabled.
    */
    endDate?: number;

    /**
    *  String, Array. Default: '', []
    *  Days of the week that should be disabled. Values are 0 (Sunday) to 6 (Saturday). Multiple values should be comma-separated. Example:
    *  disable weekends: '0,6' or [0,6].
    */
    daysOfWeekDisabled?: string | number[];

    /**
    *  Boolean. Default: false
    *  Whether or not to close the datetimepicker immediately when a date is selected.
    */
    autoclose?: number|boolean;

    /**
    *  Number, String. Default: 2, 'month'
    *  The view that the datetimepicker should show when it is opened. Accepts values of :
    *  0 or 'hour' for the hour view
    *  1 or 'day' for the day view
    *  2 or 'month' for month view (the default)
    *  3 or 'year' for the 12-month overview
    *  4 or 'decade' for the 10-year overview. Useful for date-of-birth datetimepickers.
    */
    startView?: number | string;

    /**
    *  Number, String. Default: 0, 'hour'
    *  The lowest view that the datetimepicker should show.
    */
    minView?: number|string;

    /**
    *  Number, String. Default: 4, 'decade'
    *  The highest view that the datetimepicker should show.
    */
    maxView?: number | string;

    /**
    *  Boolean, "linked". Default: false
    *  If true or "linked", displays a "Today" button at the bottom of the datetimepicker to select the current date. If true, the "Today" button will only
    *  move the current date into view; if "linked", the current date will also be selected.
    */
    todayBtn?: boolean | number;

    /**
    *  Boolean. Default: false
    *  If true, highlights the current date.
    */
    todayHighlight?: boolean | number;

    /**
    *  Boolean. Default: true
    *  Whether or not to allow date navigation by arrow keys.
    */
    keyboardNavigation?: boolean | number;

    /**
    *  String. Default: 'en'
    *  The two-letter code of the language to use for month and day names. These will also be used as the input's value (and subsequently sent to the server in the case of form submissions). Currently ships with English ('en'), German ('de'), Brazilian ('br'), and Spanish ('es') translations, but others can be added (see I18N below). If an unknown language code is given, English will be used.
    */
    language?: string;

    /**
    *  Boolean. Default: true
    *  Whether or not to force parsing of the input value when the picker is closed. That is, when an invalid date is left in the input field by the user, the picker will forcibly parse that value, and set the input's value to the new, valid date, conforming to the given format.
    */
    forceParse?: boolean | number;

    /**
    *  Number. Default: 5
    *  The increment used to build the hour view. A preset is created for each minuteStep minutes.
    */
    minuteStep?: number;

    /**
    *  String. Default: 'bottom-right' (other value supported : 'bottom-left')
    *  This option is currently only available in the component implementation. With it you can place the picker just under the input field.
    */
    pickerPosition?: number;

    /**
    *  Number or String. Default: same as minView (supported values are: 'decade', 'year', 'month', 'day', 'hour')
    *  With this option you can select the view from which the date will be selected. By default it's the last one, however you can choose the first one, so at each click the date will be updated.
    */
    viewSelect?: number | string;

    /**
    *  Boolean. Default: false
    *  This option will enable meridian views for day and hour views.
    */
    showMeridian?: number | boolean;

    /**
    *  Date or String. Default: new Date()
    *  You can initialize the viewer with a date. By default it's now, so you can specify yesterday or today at midnight ...
    */
    initialDate?: number | boolean;

}               