/**
 * Catbox API Client
 * A typed wrapper for interacting with the Catbox API
 */

// API endpoint
const CATBOX_API_URL = "https://catbox.moe/user/api.php"

// Request types supported by the API
type RequestType =
  | "fileupload"
  | "urlupload"
  | "deletefiles"
  | "createalbum"
  | "editalbum"
  | "addtoalbum"
  | "removefromalbum"
  | "deletealbum"

// Core API parameters shared across requests
interface ApiRequestBase {
  reqtype: RequestType
  userhash?: string
}

// File upload request parameters
interface FileUploadRequest extends ApiRequestBase {
  reqtype: "fileupload"
  fileToUpload: File
}

// URL upload request parameters
interface UrlUploadRequest extends ApiRequestBase {
  reqtype: "urlupload"
  url: string
}

// Delete files request parameters
interface DeleteFilesRequest extends ApiRequestBase {
  reqtype: "deletefiles"
  userhash: string // Required for deletion
  files: string
}

// Create album request parameters
interface CreateAlbumRequest extends ApiRequestBase {
  reqtype: "createalbum"
  title: string
  desc?: string
  files: string
}

// Edit album request parameters
interface EditAlbumRequest extends ApiRequestBase {
  reqtype: "editalbum"
  userhash: string // Required for editing
  short: string
  title: string
  desc: string
  files: string
}

// Add to album request parameters
interface AddToAlbumRequest extends ApiRequestBase {
  reqtype: "addtoalbum"
  userhash: string // Required for modification
  short: string
  files: string
}

// Remove from album request parameters
interface RemoveFromAlbumRequest extends ApiRequestBase {
  reqtype: "removefromalbum"
  userhash: string // Required for modification
  short: string
  files: string
}

// Delete album request parameters
interface DeleteAlbumRequest extends ApiRequestBase {
  reqtype: "deletealbum"
  userhash: string // Required for deletion
  short: string
}

// Union type of all possible request types
type CatboxRequest =
  | FileUploadRequest
  | UrlUploadRequest
  | DeleteFilesRequest
  | CreateAlbumRequest
  | EditAlbumRequest
  | AddToAlbumRequest
  | RemoveFromAlbumRequest
  | DeleteAlbumRequest

/**
 * Formats an array of file IDs into a space-separated string
 * as required by the Catbox API
 */
export function formatFiles(files: Array<string>): string {
  return files.join(" ")
}

/**
 * Core function to send requests to the Catbox API
 * Handles the different request types and formats data appropriately
 */
export async function catboxRequest(params: CatboxRequest): Promise<string> {
  const formData = new FormData()

  // Add all parameters to FormData
  for (const [key, value] of Object.entries(params)) {
    // Special handling for file uploads
    if (key === "fileToUpload" && value instanceof File) {
      formData.append(key, value)
    } else if (value !== undefined) {
      formData.append(key, String(value))
    }
  }

  try {
    const response = await fetch(CATBOX_API_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.text()
  } catch (error) {
    // Re-throw with more context
    throw new Error(`Catbox API request failed: ${(error as Error).message}`)
  }
}

/**
 * Helper class with convenience methods for all API operations
 */
export class CatboxClient {
  private userHash?: string

  constructor(userHash?: string) {
    this.userHash = userHash
  }

  /**
   * Upload a file directly
   */
  async uploadFile(file: File): Promise<string> {
    return catboxRequest({
      reqtype: "fileupload",
      userhash: this.userHash,
      fileToUpload: file,
    })
  }

  /**
   * Upload a file from a URL
   */
  async uploadUrl(url: string): Promise<string> {
    return catboxRequest({
      reqtype: "urlupload",
      userhash: this.userHash,
      url,
    })
  }

  /**
   * Delete files from Catbox
   * Requires authentication
   */
  async deleteFiles(fileIds: Array<string>): Promise<string> {
    if (!this.userHash) {
      throw new Error("Authentication required for file deletion")
    }

    return catboxRequest({
      reqtype: "deletefiles",
      userhash: this.userHash,
      files: formatFiles(fileIds),
    })
  }

  /**
   * Create a new album
   */
  async createAlbum(options: {
    title: string
    files: Array<string>
    description?: string
  }): Promise<string> {
    return catboxRequest({
      reqtype: "createalbum",
      userhash: this.userHash,
      title: options.title,
      desc: options.description,
      files: formatFiles(options.files),
    })
  }

  /**
   * Edit an existing album (complete replacement)
   * Requires authentication
   */
  async editAlbum(options: {
    short: string
    title: string
    description: string
    files: Array<string>
  }): Promise<string> {
    if (!this.userHash) {
      throw new Error("Authentication required for album editing")
    }

    return catboxRequest({
      reqtype: "editalbum",
      userhash: this.userHash,
      short: options.short,
      title: options.title,
      desc: options.description,
      files: formatFiles(options.files),
    })
  }

  /**
   * Add files to an existing album
   * Requires authentication
   */
  async addToAlbum(albumId: string, fileIds: Array<string>): Promise<string> {
    if (!this.userHash) {
      throw new Error("Authentication required for album modification")
    }

    return catboxRequest({
      reqtype: "addtoalbum",
      userhash: this.userHash,
      short: albumId,
      files: formatFiles(fileIds),
    })
  }

  /**
   * Remove files from an existing album
   * Requires authentication
   */
  async removeFromAlbum(
    albumId: string,
    fileIds: Array<string>,
  ): Promise<string> {
    if (!this.userHash) {
      throw new Error("Authentication required for album modification")
    }

    return catboxRequest({
      reqtype: "removefromalbum",
      userhash: this.userHash,
      short: albumId,
      files: formatFiles(fileIds),
    })
  }

  /**
   * Delete an album
   * Requires authentication
   */
  async deleteAlbum(albumId: string): Promise<string> {
    if (!this.userHash) {
      throw new Error("Authentication required for album deletion")
    }

    return catboxRequest({
      reqtype: "deletealbum",
      userhash: this.userHash,
      short: albumId,
    })
  }
}
