import { Request, Response } from "express";
import service from "./service";
import Case from "./CaseModel";
import getCurrentTime from "../lib/time";
import { Status } from "./Status";
import { toCaseDUO } from "./helper";
import { ImageDUO } from "./ImageModule/imageModel";
import fs from "fs";
import path from "path";
import imageService from "./ImageModule/imageService";

const getAll = async (req: Request, res: Response) => {
  try {
    const cases = await service.findAll();

    if (cases?.length === 0)
      return res.status(404).json({ error: "Cases not found" });
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

const getByQuery = async (req: Request, res: Response) => {
  const user_id = req.query.user as string;
  const name = req.query.name as string;
  const case_id = (req.query.case as string)
    ? Number(req.query.case)
    : undefined;
  const status_id = (req.query.status as string)
    ? Number(req.query.status)
    : undefined;
  const place_case = req.query.place as string;
  const date = req.query.date as string;
  try {
    const cases = await service.findMany({
      user_id,
      case_id,
      status_id,
      name_case: {
        contains: name,
      },
      place_case: {
        contains: place_case,
      },
      date_case: {
        gte: date ? new Date(date) : undefined,
      },
    });
    if (cases?.length === 0)
      return res.status(404).json({ error: "Case not found" });
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
    // files to imasgeDUO array
    for (const file of files) {
      const uploadPath = path.join(process.cwd(), "dist/src/assets/uploads/");
      const image: ImageDUO = {
        image: fs.readFileSync(path.join(uploadPath, file.filename)),
      };
      images.push(image);
      fs.unlinkSync(path.join(uploadPath, file.filename));
    }

    newCase.status_id = Status.PENDING;
    newCase.date_case = getCurrentTime();
    newCase.images = images;
    const caseDUO = await service.create(toCaseDUO(newCase));
    if (!caseDUO) return res.status(404).json({ error: "Case not found" });
    return res.status(200).json(caseDUO);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const update = async (req: Request, res: Response) => {};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cases = await service.findOne({ case_id: Number(id) });
    if (!cases) return res.status(404).json({ error: "Case not found" });

    await imageService.deleteMany({ case_id: Number(id) });
    await service.delete({ case_id: Number(id) });
    return res.status(200).json({ message: "Case deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);

      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { getAll, getOne, getByQuery, create, update, remove };
