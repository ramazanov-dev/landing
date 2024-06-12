import {useRef, useState} from "react";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import onError from "../../utils/on-error.ts";
import Icon from "../Icon";
import LoadingWheel from "../LoadingWheel";

interface FileModel {
  _id: string;
  displayName: string;
  size: number;
  type: string;
  path: string;
}

export default function FileUploader(props: {
  onDone(file: FileModel): void;
  isDone?: boolean;
}) {
  /* Refs */
  const fileUploaderRef = useRef<HTMLInputElement>(null);

  /* State */
  const [state, setState] = useState<"ready" | "pending" | "done">("ready");

  /* On upload */
  function onUpload() {
    const file = fileUploaderRef.current?.files?.[0];

    if(!file) return;

    setState("pending");

    const formData = new FormData();
    formData.append("file", file, file.name);

    fetch("/files/upload", {
      method: "POST",
      body: formData
    })
      .then(validateStatus)
      .then(({data: file}) => {
        setState("done");
        props.onDone(file);
      })
      .catch(onError);
  }

  /* DOM (state "ready") */
  if(!props.isDone && state === "ready") {
    return (
      <>
        <input
          ref={fileUploaderRef}
          type="file"
          accept="image/*"
          onChange={() => onUpload()}
        />
        <button
          className="isBlack isDuctile"
          onClick={() => fileUploaderRef.current?.click()}
        >
          <span>Upload</span>
          <Icon icon="custom-arrow-top-right-1" />
        </button>
      </>
    );
  } else if(!props.isDone && state === "pending") {
    /* DOM (state "pending") */
    return (
      <button className="isBlack isDuctile">
        <LoadingWheel size={24} spinsPerSecond={2} width={3} color="#fff" />
        <span>Uploading...</span>
      </button>
    );
  } else if(state === "done" || props.isDone) {
    return (
      <button className="isGreen isDuctile">
        <span>Uploaded</span>
        <Icon icon="custom-check-1" />
      </button>
    );
  }

  /* Otherwise return null */
  return null;
}
