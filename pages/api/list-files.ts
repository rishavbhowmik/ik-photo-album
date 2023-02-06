// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ImageKit from "imagekit";
import { FileObject } from "imagekit/dist/libs/interfaces";

if (process.env.IK_PUB_KEY === undefined) throw Error("IK_PUB_KEY required");
const IK_PUB_KEY = process.env.IK_PUB_KEY;

if (process.env.IK_PVT_KEY === undefined) throw Error("IK_PVT_KEY required");
const IK_PVT_KEY = process.env.IK_PVT_KEY;

if (process.env.IK_ENDPOINT === undefined) throw Error("IK_ENDPOINT required");
const IK_ENDPOINT = process.env.IK_ENDPOINT;

const imagekit = new ImageKit({
  publicKey: IK_PUB_KEY,
  privateKey: IK_PVT_KEY,
  urlEndpoint: IK_ENDPOINT,
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FileObject[]>
) {
    console.log(req.body)
   imagekit.listFiles({
        skip : 10,
        limit : 10
    }).then((fileList) => {
        console.log({fileList})
        res.status(200).json(fileList);
    });
}
