import { Request, Response } from "express";
import service from "./service";
import Case, { CaseDUO } from "./CaseModel";
import Image from "./ImageModule/imageModel";
import getCurrentTime from "../lib/time";
import { images } from ".prisma/client";
import { Status } from "./Status";
import { toCaseDUO } from "./helper";
import { ImageDUO } from "./ImageModule/imageModel";
import fs from "fs";
import path from "path";

const getAll = async (req: Request, res: Response) => {
  try {
    const cases = await service.findAll();

    if (!cases) return res.status(404).json({ error: "Cases not found" });
    return res.status(200).json(cases);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cases = await service.findOne({ case_id: Number(id) });
    if (!cases) return res.status(404).json({ error: "Case not found" });
    return res.status(200).json(cases);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getByName = async (req: Request, res: Response) => {
  const name = req.query.name?.toString();
  try {
    const cases = await service.findMany({
      name_case: {
        contains: name,
      },
    });
    if (!cases) return res.status(404).json({ error: "Case not found" });
    return res.status(200).json(cases);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const create = async (req: Request, res: Response) => {
  const newCase: Case = req.body;
  try {
    let files: Express.Multer.File[] | undefined = req.files as
      | Express.Multer.File[]
      | undefined;
    if (files === undefined || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const images: ImageDUO[] = [];
    // files to imageDUO array
    for (const file of files) {
      const uploadPath = path.join(process.cwd(), "dist/src/assets/uploads/");
      const image: ImageDUO = {
        image: fs.readFileSync(path.join(uploadPath, file.filename)),
      };
      images.push(image);
    }
    newCase.status_id = Status.PENDING;
    newCase.date_case = getCurrentTime();
    newCase.images = images;
    const caseDUO = await service.create(toCaseDUO(newCase));
    if (!caseDUO) return res.status(404).json({ error: "Case not found" });
    return res.status(200).json(caseDUO);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const update = async (req: Request, res: Response) => {};

const remove = async (req: Request, res: Response) => {};

export { getAll, getOne, getByName, create, update, remove };
