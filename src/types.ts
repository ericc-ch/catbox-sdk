type RequestType =
  | "fileupload"
  | "urlupload"
  | "deletefiles"
  | "createalbum"
  | "editalbum"
  | "addtoalbum"
  | "removefromalbum"
  | "deletealbum"

interface RequestBase {
  reqtype: RequestType
  userhash?: string
}

/**
 * For an anonymous uploads, don't give a `userhash`.
 */
interface FileUploadRequest extends RequestBase {
  reqtype: "fileupload"
  fileToUpload: File
}

/**
 * For an anonymous uploads, don't give a `userhash`.
 */
interface UrlUploadRequest extends RequestBase {
  reqtype: "urlupload"
  url: string
}

interface DeleteFilesRequest extends RequestBase {
  reqtype: "deletefiles"
  /**
   * Required for file deletion.
   */
  userhash: string
  files: string
}

/**
 * For an anonymous album, don't give a `userhash`. Albums created anonymously CANNOT be edited or deleted.
 *
 * Albums are currently limited to 500 files. This may be removed in the future.
 */
interface CreateAlbumRequest extends RequestBase {
  reqtype: "createalbum"
  title: string
  desc?: string
  /**
   * `files` is string of space-separated file names which exist on Catbox.
   */
  files: string
}

// Edit album request parameters
interface EditAlbumRequest extends RequestBase {
  reqtype: "editalbum"
  userhash: string // Required for editing
  short: string
  title: string
  desc: string
  files: string
}

// Add to album request parameters
interface AddToAlbumRequest extends RequestBase {
  reqtype: "addtoalbum"
  userhash: string // Required for modification
  short: string
  files: string
}

// Remove from album request parameters
interface RemoveFromAlbumRequest extends RequestBase {
  reqtype: "removefromalbum"
  userhash: string // Required for modification
  short: string
  files: string
}

// Delete album request parameters
interface DeleteAlbumRequest extends RequestBase {
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
