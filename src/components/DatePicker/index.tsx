/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable perfectionist/sort-imports */
import { FC, JSX, useState } from 'react'
import { ru } from 'date-fns/locale'
import { eachDayOfInterval, format, setHours, setMonth } from 'date-fns'
import { DateFormatter, DateRange, DayPicker, StyledComponent } from 'react-day-picker'
import { ReactComponent as IconShevronLeft } from '../../assets/shevron-left.svg'
import TimeSlider from '../TimeSlider'

import stylesDayPicker from 'react-day-picker/dist/style.module.css'
import styles from './styles.module.scss'

const DEFAULT_HOURS = 11

const CURRENT_DATE = new Date()

const FIRST_DATE_OF_MONTH = format(CURRENT_DATE, 'yyyy-MM-01')

const DISABLE_DAYS = eachDayOfInterval({
  end: CURRENT_DATE,
  start: new Date(FIRST_DATE_OF_MONTH),
})

type Props = {
  month?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  onDateRange: (range: DateRange | undefined) => void
}

const DatePicker: FC<Props> = ({ month, onDateRange }) => {
  const date = month ? setMonth(CURRENT_DATE, month) : CURRENT_DATE

  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [hoursTime, setHoursTime] = useState({ endHours: DEFAULT_HOURS, startHours: DEFAULT_HOURS })

  const onHandleSetRange = (updRange: DateRange | undefined) => {
    const { endHours, startHours } = hoursTime

    const to = updRange?.to ? setHours(updRange.to, endHours) : updRange?.to
    const from = updRange?.from ? setHours(updRange.from, startHours) : updRange?.from

    setRange({ from, to })
    onDateRange({ from, to })
    return updRange
  }

  const setTimeEnd = (updTime: Array<number>) => {
    const [hours] = updTime
    const to = range?.to ? setHours(range.to, hours) : setHours(CURRENT_DATE, hours)
    const from = range ? range.from : undefined
    setHoursTime((prev) => ({ ...prev, endHours: hours }))
    onDateRange({ from, to })
  }
  const setTimeStart = (updTime: Array<number>) => {
    const [hours] = updTime
    const from = range?.from ? setHours(range.from, hours) : setHours(CURRENT_DATE, hours)
    const to = range ? range.to : undefined
    setHoursTime((prev) => ({ ...prev, startHours: hours }))
    onDateRange({ from, to })
  }

  const formatCaption: DateFormatter = (formatDate) => {
    return (
      <div className={styles.label}>
        <span>{format(formatDate, 'LLLL,', { locale: ru })}</span>
        <span>{format(formatDate, 'y')}</span>
      </div>
    )
  }

  const IconLeft = (props: StyledComponent): JSX.Element => {
    return <IconShevronLeft {...props} />
  }
  const IconRight = (props: StyledComponent): JSX.Element => {
    return <IconShevronLeft {...props} className={styles.iconRight} />
  }

  return (
    <div className={styles.datePickerWrapper}>
      <DayPicker
        classNames={{
          ...stylesDayPicker,
          caption: styles.caption,
          caption_end: styles.captionEnd,
          caption_label: styles.captionLabel,
          day: styles.day,
          head_cell: styles.headCell,
          nav: styles.nav,
        }}
        modifiersClassNames={{
          outside: styles.outside,
          range_end: styles.rangeEnd,
          range_middle: styles.rangeMiddle,
          range_start: styles.rangeStart,
          today: styles.today,
        }}
        components={{ IconLeft, IconRight }}
        disabled={DISABLE_DAYS}
        formatters={{ formatCaption }}
        locale={ru}
        mode="range"
        month={date}
        numberOfMonths={2}
        onSelect={onHandleSetRange}
        pagedNavigation
        selected={range}
      />
      <section className={styles.times}>
        <TimeSlider label="Получение транспорта" onChange={setTimeStart} step={1} value={[hoursTime.startHours]} />
        <TimeSlider label="Возврат транспорта" onChange={setTimeEnd} step={1} value={[hoursTime.endHours]} />
      </section>
    </div>
  )
}

export default DatePicker
