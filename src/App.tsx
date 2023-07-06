import { useState } from 'react'

import DatePicker from './components/DatePicker'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'

import './App.css'
import 'react-day-picker/dist/style.css'

const App = () => {
  const [range, onSetRange] = useState<DateRange | undefined>(undefined)
  const isNotSelectDate = !range || (!range.from && !range.to)

  return (
    <div className="app">
      <DatePicker onDateRange={onSetRange} />
      <div className="info">
        {isNotSelectDate && <p>Укажите срок аренды авто</p>}
        {!isNotSelectDate && (
          <>
            {range.from && <p>{`Старт: ${format(range.from as Date, 'dd MMMM HH:00', { locale: ru })}`}</p>}
            {range.to && <p>{`Финиш: ${format(range.to as Date, 'dd MMMM HH:00', { locale: ru })}`}</p>}
            {!range.to && <p>Выберите время возврата авто</p>}
          </>
        )}
      </div>
    </div>
  )
}

export default App
