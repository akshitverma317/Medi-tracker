import React, { useState, useMemo } from 'react'
import { useSchedule } from '../contexts/ScheduleContext.jsx'
import { useMedicines } from '../contexts/MedicineContext.jsx'
import { usePatients } from '../contexts/PatientContext.jsx'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, addDays, subDays, addMonths, subMonths, isSameDay } from 'date-fns'
import { formatDateISO } from '../utils/dateHelpers.js'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Badge from '../components/shared/Badge.jsx'
import DoseItem from '../components/shared/DoseItem.jsx'

/**
 * CalendarPage Component
 * 
 * Weekly and monthly calendar view of medicine schedules
 */
const CalendarPage = () => {
  const [view, setView] = useState('week') // 'week' or 'month'
  const [currentDate, setCurrentDate] = useState(new Date())
  const { getDosesForDate } = useSchedule()
  const { medicines } = useMedicines()
  const { selectedPatientId } = usePatients()

  const navigatePrevious = () => {
    if (view === 'week') {
      setCurrentDate(prev => subDays(prev, 7))
    } else {
      setCurrentDate(prev => subMonths(prev, 1))
    }
  }

  const navigateNext = () => {
    if (view === 'week') {
      setCurrentDate(prev => addDays(prev, 7))
    } else {
      setCurrentDate(prev => addMonths(prev, 1))
    }
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-800">Calendar</h2>
          <p className="text-neutral-600 mt-1">
            {view === 'week' ? 'Weekly' : 'Monthly'} medicine schedule
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={view === 'week' ? 'primary' : 'secondary'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'primary' : 'secondary'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={navigatePrevious}>
            ← Previous
          </Button>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-neutral-800">
              {view === 'week'
                ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM yyyy')}
            </h3>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="outline" onClick={navigateNext}>
              Next →
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar View */}
      {view === 'week' ? (
        <WeekView
          currentDate={currentDate}
          getDosesForDate={getDosesForDate}
          selectedPatientId={selectedPatientId}
          medicines={medicines}
        />
      ) : (
        <MonthView
          currentDate={currentDate}
          getDosesForDate={getDosesForDate}
          selectedPatientId={selectedPatientId}
        />
      )}
    </div>
  )
}

/**
 * WeekView Component
 */
const WeekView = ({ currentDate, getDosesForDate, selectedPatientId, medicines }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {days.map((day) => {
        const dateStr = formatDateISO(day)
        const doses = getDosesForDate(dateStr, selectedPatientId)
        const isToday = isSameDay(day, new Date())

        return (
          <Card
            key={dateStr}
            className={`${isToday ? 'ring-2 ring-primary-500' : ''}`}
          >
            <div className="text-center mb-3">
              <div className="text-sm font-medium text-neutral-600">
                {format(day, 'EEE')}
              </div>
              <div className={`text-2xl font-bold ${isToday ? 'text-primary-600' : 'text-neutral-800'}`}>
                {format(day, 'd')}
              </div>
            </div>

            <div className="space-y-2">
              {doses.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-4">
                  No doses
                </p>
              ) : (
                doses.slice(0, 3).map((dose) => (
                  <div key={dose.id} className="text-xs">
                    <Badge status={dose.status} size="small" className="w-full justify-center" />
                  </div>
                ))
              )}
              {doses.length > 3 && (
                <p className="text-xs text-neutral-500 text-center">
                  +{doses.length - 3} more
                </p>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

/**
 * MonthView Component
 */
const MonthView = ({ currentDate, getDosesForDate, selectedPatientId }) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <Card>
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
          {week.map((day) => {
            const dateStr = formatDateISO(day)
            const doses = getDosesForDate(dateStr, selectedPatientId)
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()

            return (
              <div
                key={dateStr}
                className={`min-h-[80px] p-2 rounded border ${
                  isToday
                    ? 'border-primary-500 bg-primary-50'
                    : isCurrentMonth
                    ? 'border-neutral-200 bg-white'
                    : 'border-neutral-100 bg-neutral-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-primary-600' : isCurrentMonth ? 'text-neutral-800' : 'text-neutral-400'
                }`}>
                  {format(day, 'd')}
                </div>

                {doses.length > 0 && (
                  <div className="space-y-1">
                    {doses.slice(0, 2).map((dose) => (
                      <div key={dose.id} className="text-xs">
                        <Badge status={dose.status} size="small" />
                      </div>
                    ))}
                    {doses.length > 2 && (
                      <p className="text-xs text-neutral-500">
                        +{doses.length - 2}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </Card>
  )
}

export default CalendarPage
