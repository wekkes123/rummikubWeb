import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';


/**
 * makes an input visual so the user can pick a date (it's consists of the input parts)
 * @param value
 * @param onChange
 * @param t
 * @returns {*}
 * @constructor
 */
function ThreeDatePicker({ value, onChange, t }) {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        if (value) {
            setDay(value.date().toString());
            setMonth((value.month() + 1).toString());
            setYear(value.year().toString());
        } else {
            setDay('');
            setMonth('');
            setYear('');
        }
    }, [value]);

    const handleChange = (part, val) => {
        const cleanVal = val.replace(/\D/g, '');

        if (part === 'day') setDay(cleanVal);
        if (part === 'month') setMonth(cleanVal);
        if (part === 'year') setYear(cleanVal);

        const d = part === 'day' ? cleanVal : day;
        const m = part === 'month' ? cleanVal : month;
        const y = part === 'year' ? cleanVal : year;


        if (d.length >= 1 && m.length >= 1 && y.length === 4) {
            const date = dayjs(`${y}-${m}-${d}`, 'YYYY-M-D');
            if (date.isValid() && !date.isAfter(dayjs())) {
                onChange(date);
            } else {
                onChange(null);
            }
        } else {
            onChange(null);
        }
    };

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <input
                type="number"
                min={1}
                max={31}
                placeholder={t('day')}
                value={day}
                onChange={e => handleChange('day', e.target.value)}
                style={{ width: '5rem' }}
            />
            <input
                type="number"
                min={1}
                max={12}
                placeholder={t('month')}
                value={month}
                onChange={e => handleChange('month', e.target.value)}
                style={{ width: '6rem' }}
            />
            <input
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                placeholder={t('year')}
                value={year}
                onChange={e => handleChange('year', e.target.value)}
                style={{ width: '6rem' }}
            />
        </div>
    );
}

export default ThreeDatePicker;
