'use strict'

import EE from 'events'
import { Slice } from '../slice'
import { SliceId } from '../slice-id'

export abstract class BaseTracker extends EE {
  slices: Set<Slice>
  isStarted: boolean

  constructor (slices?: Set<Slice>) {
    super()
    this.slices = slices || new Set()
    this.isStarted = false
  }

  /**
   * Stop tracking the provided slices
   *
   * @param {Set<SliceId>} slices - the slices to stop tracking
   */
  abstract untrack (slices: Set<SliceId>): Promise<void>

  /**
   * This will discover, connect and start tracking
   * the requested slices from the network.
   *
   * @param {Set<SliceId>} slices - a slice or an Set of slices to track
   */
  abstract track (slices: Set<SliceId>): Promise<void>

  /**
   * Check wether the slice is already being tracked
   *
   * @param {SliceId} slice - the slice id
   * @returns {Boolean}
   */
  abstract isTracking (slice: SliceId): Promise<boolean>

  /**
   * Publish the slice
   *
   * @param {Slice} slice - the slice to be published
   */
  abstract publish (slice: Slice): Promise<void>

  /**
   * Get the requested slice
   *
   * @param {SliceId} slice
   */
  abstract getSlice (slice: SliceId): Promise<Slice>

  /**
   * Start tracker
   */
  abstract start (): Promise<void>

  /**
   * Stop tracker
   */
  abstract stop (): Promise<void>
}
