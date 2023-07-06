import { FC, MutableRefObject, useRef } from 'react'

import clsx from 'clsx'
import { mergeProps, useFocusRing, useNumberFormatter, useSlider, useSliderThumb, VisuallyHidden } from 'react-aria'
import { SliderState, useSliderState } from 'react-stately'

import { formatTime } from '../../utils/format-time'

import styles from './styles.module.scss'

type PropsThumb = {
  index: number
  state: SliderState
  trackRef: MutableRefObject<null>
}

type PropsTimeSlider = {
  formatOptions?: {
    currency: string
    minimumFractionDigits: number
    style: string
  }
  label: string
  onChange: (value: Array<number>) => void
  step: number
  value: Array<number>
}

const Thumb: FC<PropsThumb> = ({ index, state, trackRef }) => {
  const inputRef = useRef(null)
  const { inputProps, isDragging, thumbProps } = useSliderThumb(
    {
      index,
      inputRef,
      trackRef,
    },
    state,
  )

  const { focusProps, isFocusVisible } = useFocusRing()
  return (
    <div {...thumbProps} className={clsx(styles.thumb, isFocusVisible && styles.focus, isDragging && styles.dragging)}>
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  )
}

const TimeSlider: FC<PropsTimeSlider> = (props) => {
  const trackRef = useRef(null)
  const numberFormatter = useNumberFormatter(props.formatOptions)

  const state = useSliderState({ ...props, maxValue: 24, numberFormatter })
  const { groupProps, labelProps, outputProps, trackProps } = useSlider(props, state, trackRef)

  return (
    <div {...groupProps} className={clsx(styles.slider, styles[state.orientation])}>
      {props.label && (
        <div className={styles.labelContainer}>
          <label {...labelProps}>{props.label}</label>
          <output {...outputProps}>{formatTime(state.getThumbValueLabel(0))}</output>
        </div>
      )}
      <div {...trackProps} className={clsx(styles.track, state.isDisabled && styles.disabled)} ref={trackRef}>
        <Thumb index={0} state={state} trackRef={trackRef} />
      </div>
    </div>
  )
}

export default TimeSlider
