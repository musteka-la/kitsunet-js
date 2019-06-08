'use strict'

/**
 * Interface that all downloaders implemente
 */
export interface Downloader {
  download (): Promise<void>
}
