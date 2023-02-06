import { useState } from "react";
import AnimationStyles from "@/styles/animation.module.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";

export const IK_PUB_KEY = "public_EjLGczFiICW0x9a/WMGXA6V4wtE=";

type UploadState = undefined | "progress" | "complete" | "failed";
type UploadQueueItem = {
  uuid: string;
  file: File;
};

const uploadRequest = (formData: FormData) => {
  const uploadFileXHR = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    uploadFileXHR.open(
      "POST",
      "https://upload.imagekit.io/api/v1/files/upload"
    );
    uploadFileXHR.onerror = (e) => {
      return reject(e);
    };
    uploadFileXHR.onload = () => {
      if (uploadFileXHR.status === 200) {
        try {
          return resolve(JSON.parse(uploadFileXHR.responseText));
        } catch (ex: any) {
          return reject(ex);
        }
      } else {
        try {
          return reject(JSON.parse(uploadFileXHR.responseText));
        } catch (ex: any) {
          return reject(ex);
        }
      }
    };
    uploadFileXHR.send(formData);
  });
};

const uploadFile = (props: {
  file: File;
  tokenId: string;
  uuid: string;
  callback: (error?: Error) => void;
}) => {
  fetch(`/api/ik-auth?token=${props.tokenId}-${Date.now()}`)
    .then((res) => res.json())
    .then((data: { token: string; expire: number; signature: string }) => {
      const formData = new FormData();
      formData.append(
        "file",
        props.file,
      );
      formData.append(
        "fileName",
        `/1st-feb-album/${props.tokenId}/${props.file.name}`
      );
      formData.append("signature", data.signature);
      formData.append("expire", String(data.expire));
      formData.append("token", data.token);
      formData.append("publicKey", IK_PUB_KEY);
      return uploadRequest(formData);
    })
    .then(() => {
      props.callback();
    })
    .catch(props.callback);
};

const UploadItemComponent = (props: {
  item: UploadQueueItem;
  tokenId: string;
}) => {
  const [uploadState, updateUploadState] = useState<UploadState>(undefined);

  if (uploadState === undefined) {
    console.log("starting");
    uploadFile({
      ...props.item,
      tokenId: props.tokenId,
      callback: (error) => {
        console.log("cd", error);

        if (error) updateUploadState("failed");
        else updateUploadState("complete");
      },
    });
    updateUploadState("progress");
  }
  console.log("uploadState", uploadState)
  switch (uploadState) {
    case "complete":
      return (
        <IconButton>
          <CheckCircleIcon color="success" />
        </IconButton>
      );
    case "failed":
      return (
        <IconButton>
          <SyncProblemIcon color="error" />
        </IconButton>
      );
    default:
      return (
        <IconButton>
          <SyncIcon color="info" className={AnimationStyles.rt} />
        </IconButton>
      );
  }
};

export const UploadUi = (props: { tokenUuid: string }) => {
  const [uploadQueue, updateUploadQueue] = useState<UploadQueueItem[]>([]);

  const addToUploadQueue = (fileList: FileList) => {
    const newItems = Array.from(fileList).map((file) => ({
      file,
      uuid: crypto.randomUUID(),
    }));
    updateUploadQueue([
      ...uploadQueue,
      ...newItems.map(({ uuid, file }) => ({
        uuid,
        file,
      })),
    ]);
  };

  const openFileSelect = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.oninput = (e) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files !== null) addToUploadQueue(files);
    };
    fileInput.click();
  };

  return (
    <div>
      <div>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={openFileSelect}
          style={{
            alignSelf: "center",
          }}
        >
          Upload <FileUploadIcon />
        </Button>
      </div>
      <br />
      <div
        style={{
          maxHeight: "150px",
          overflow: "scroll",
        }}
      >
        {uploadQueue
          .map((item) => (
            <Box key={item.uuid}>
              <UploadItemComponent item={item} tokenId={props.tokenUuid} />
              {item.file.name}
            </Box>
          ))
          .reverse()}
      </div>
    </div>
  );
};
