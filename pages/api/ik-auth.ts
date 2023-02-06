// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ImageKit from "imagekit";

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

const EXPIRY_DUR_MS =  15 * 60 * 1000; // 15 mins

type Data = {
    token: string;
    expire: number;
    signature: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = req.query.token as string;
  const authenticationParameters = imagekit.getAuthenticationParameters(
    token,
    Math.floor((Date.now() + EXPIRY_DUR_MS) / 1000)
  );
  res.status(200).json(authenticationParameters);
}
