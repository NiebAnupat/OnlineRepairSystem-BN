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
import UserService from "../users/service";

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
  const getImages = req.query.getImages as string;
  try {
    const cases = await service.findOne(
      { case_id: Number(id) },
      getImages === "true" ? true : false
    );
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
  const tec_id = req.query.tec as string;
  const name = req.query.name as string;
  const case_id = (req.query.case as string)
    ? Number(req.query.case)
    : undefined;
  const status_id = (req.query.status as string)
    ? Number(req.query.status)
    : undefined;
  const place_case = req.query.place as string;
  const date = req.query.date as string;
  const date_close = req.query.date_close as string;
  const getImages = req.query.getImages as string;
  try {
    const cases = await service.findMany(
      {
        user_id,
        case_id,
        status_id,
        tec_id,
        name_case: {
          contains: name,
        },
        place_case: {
          contains: place_case,
        },
        date_case: {
          gte: date ? new Date(date) : undefined,
        },
        date_close: date_close
          ? date_close !== "null"
            ? new Date(date_close)
            : null
          : undefined,
      },
      getImages === "true" ? true : false
    );
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

const technicalUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tec_id, status_id, date_assign, date_sent, date_close } = req.body;
  const st_id = Number(status_id);
  try {
    const tec = await UserService.findOne({
      user_id: tec_id,
      user_role: "worker",
    });
    if (!tec) return res.status(404).json({ error: "Technical not found" });

    if (
      st_id != Status.IN_PROGRESS &&
      st_id != Status.REPAIRING &&
      st_id != Status.DONE
    )
      return res.status(400).json({ error: "Invalid status" });

    const cases = await service.findOne({ case_id: Number(id) });
    if (!cases) return res.status(404).json({ error: "Case not found" });

    // check case is have technical
    if (cases.tec_id !== null) {
      if (cases.tec_id != tec_id)
        return res.status(405).json({ error: "Technical not have permission" });
      const updatedCase = await service.update(
        { case_id: Number(id) },
        {
          ...(status_id && { status_id: st_id }),
          ...(date_assign && {
            date_assign: new Date(date_assign),
          }),
          ...(date_sent && { date_sent: new Date(date_sent) }),
          ...(date_close && { date_close: new Date(date_close) }),
        }
      );
      return res.status(200).json(updatedCase);
    } else {
      const updatedCase = await service.update(
        { case_id: Number(id) },
        {
          ...(tec_id && { tec_id: tec_id }),
          ...(status_id && { status_id: st_id }),
          ...(date_assign && {
            date_assign: new Date(date_assign),
          }),
          ...(date_sent && { date_sent: new Date(date_sent) }),
        }
      );
      return res.status(200).json(updatedCase);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const userUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date_close } = req.body;
  try {
    const cases = await service.findOne({ case_id: Number(id) });
    if (!cases) return res.status(404).json({ error: "Case not found" });
    const updatedCase = await service.update(
      { case_id: Number(id) },
      {
        ...(date_close && { date_close: new Date(date_close) }),
      }
    );
    return res.status(200).json(updatedCase);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const adminUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    tec_id,
    name_case,
    detail_case,
    place_case,
    status_id,
    date_assign,
    date_sent,
    date_close,
  } = req.body;
  try {
    const cases = await service.findOne({ case_id: Number(id) });
    if (!cases) return res.status(404).json({ error: "Case not found" });
    const updatedCase = await service.update(
      { case_id: Number(id) },
      {
        ...(tec_id && { tec_id: tec_id }),
        ...(name_case && { name_case: name_case }),
        ...(detail_case && { detail_case: detail_case }),
        ...(place_case && { place_case: place_case }),
        ...(status_id && { status_id: Number(status_id) }),
        ...(date_assign && {
          date_assign: new Date(date_assign),
        }),
        ...(date_sent && { date_sent: new Date(date_sent) }),
        ...(date_close && { date_close: new Date(date_close) }),
      }
    );
    return res.status(200).json(updatedCase);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

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
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export {
  getAll,
  getOne,
  getByQuery,
  create,
  technicalUpdate,
  userUpdate,
  adminUpdate,
  remove,
};
