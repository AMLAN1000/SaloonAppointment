const fs = require("fs");
const path = require("path");

const MODULES_DIR = path.join(__dirname, "app/modules");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const ROUTES_INDEX_PATH = path.join(
  __dirname,
  "app/routes/index.ts"
);

const pluralize = (str) => `${str}s`;

const templates = (moduleName) => {
  const Capitalized = capitalize(moduleName);

  return {
    controller: `
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ${moduleName}Service } from './${moduleName}.service';
import { Request, Response } from 'express';
import pick from '../../../shared/pick';

// create ${Capitalized}
const create${Capitalized} = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await ${moduleName}Service.create${Capitalized}(data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: '${Capitalized} created successfully',
    data: result,
  });
});

// get all ${Capitalized}
const ${moduleName}FilterableFields = [
  'searchTerm',
  'id',
  'createdAt',
]
const get${Capitalized}List = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, ${moduleName}FilterableFields);
  const result = await ${moduleName}Service.get${Capitalized}List( options, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${Capitalized} list retrieved successfully',
    data: result,
  });
});

// get ${Capitalized} by id
const get${Capitalized}ById = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await ${moduleName}Service.get${Capitalized}ById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${Capitalized} details retrieved successfully',
    data: result,
  });
});

// update ${Capitalized}
const update${Capitalized} = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const data = req.body;
  const result = await ${moduleName}Service.update${Capitalized}(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${Capitalized} updated successfully',
    data: result,
  });
});

// delete ${Capitalized}
const delete${Capitalized} = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await ${moduleName}Service.delete${Capitalized}(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${Capitalized} deleted successfully',
    data: result,
  });
});

export const ${moduleName}Controller = {
  create${Capitalized},
  get${Capitalized}List,
  get${Capitalized}ById,
  update${Capitalized},
  delete${Capitalized},
};
`,

    service: `
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";

// create ${Capitalized}
const create${Capitalized} = async (data: any) => {
  const result = await prisma.${moduleName}.create({
    data: {
      data: data.data
    }
  });
  return result;
};

// get all ${Capitalized}
type I${Capitalized}FilterRequest = {
  searchTerm?: string;
  id?: string;
  createdAt?: string;
}
const ${moduleName}SearchAbleFields = ['fullName', 'email', 'userName'];

const get${Capitalized}List = async (options: IPaginationOptions, filters: I${Capitalized}FilterRequest) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.${Capitalized}WhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
      ...${moduleName}SearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    ],
    });
  }

  if (Object.keys(filterData).length) {
    Object.keys(filterData).forEach((key) => {
      const value = (filterData as any)[key];
      if (value === "" || value === null || value === undefined) return;
      if (["createdAt"].includes(key) && value) {
        const start = new Date(value);
        start.setHours(0, 0, 0, 0);
        const end = new Date(value);
        end.setHours(23, 59, 59, 999);
        andConditions.push({
          createdAt: {
            gte: start.toISOString(),
            lte: end.toISOString(),
          },
        });
        return;
      }
      // if (key === "status") {
      //   const statuses = Array.isArray(value) ? value : [value];
      //   andConditions.push({
      //     status: { in: statuses },
      //   });
      //   return;
      // }
      andConditions.push({
        [key]: value,
      });
    });
  }

  const whereConditions: Prisma.${Capitalized}WhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.${moduleName}.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      createdAt: "desc",
    }
  });

  const total = await prisma.${moduleName}.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get ${Capitalized} by id
const get${Capitalized}ById = async (id: string) => {
  const result = await prisma.${moduleName}.findUnique({
   where: { id } 
   });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, '${Capitalized} not found');
  }
  return result;
};

// update ${Capitalized}
const update${Capitalized} = async (id: string, data: any) => {
  const existing${Capitalized} = await prisma.${moduleName}.findUnique({
    where: { id },
  });
  if (!existing${Capitalized}) {
    throw new ApiError(httpStatus.NOT_FOUND, '${Capitalized} not found');
  }
  const result = await prisma.${moduleName}.update({ 
  where: { id }, 
  data:{
    data: data.data ?? existing${Capitalized}.data
  }
  });
  return result;
};

// delete ${Capitalized}
const delete${Capitalized} = async (id: string) => {
  const result = await prisma.${moduleName}.delete({
   where: { id }
   });
  return result;
};

export const ${moduleName}Service = {
  create${Capitalized},
  get${Capitalized}List,
  get${Capitalized}ById,
  update${Capitalized},
  delete${Capitalized},
};
`,

    routes: `
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ${moduleName}Controller } from './${moduleName}.controller';
import { ${moduleName}Validation } from './${moduleName}.validation';

const router = express.Router();

router.post('/', auth(), ${moduleName}Controller.create${Capitalized});

router.get('/', auth(), ${moduleName}Controller.get${Capitalized}List);

router.get('/:id', auth(), ${moduleName}Controller.get${Capitalized}ById);

router.put('/:id', auth(), ${moduleName}Controller.update${Capitalized});

router.delete('/:id', auth(), ${moduleName}Controller.delete${Capitalized});

export const ${moduleName}Routes = router;
`,

    validation: `
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const ${moduleName}Validation = {
  createSchema,
  updateSchema,
};
`,
  };
};

// Generate routes registration
const registerRoute = (moduleName) => {
  if (!fs.existsSync(ROUTES_INDEX_PATH)) {
    console.error("index.ts not found!");
    return;
  }

  const routeVar = `${moduleName}Routes`;
  const routePath = `/${pluralize(moduleName.toLowerCase())}`;
  const importStatement = `import { ${routeVar} } from "../modules/${moduleName}/${moduleName}.routes";`;

  let fileContent = fs.readFileSync(ROUTES_INDEX_PATH, "utf8");
  if (fileContent.includes(importStatement)) {
    console.log("⚠️ Route already registered, skipping...");
    return;
  }

  const importRegex = /^import .*;$/gm;
  const imports = [...fileContent.matchAll(importRegex)];

  if (imports.length === 0) {
    console.error("❌ No import statements found!");
    return;
  }

  const lastImport = imports[imports.length - 1];
  const insertImportIndex = lastImport.index + lastImport[0].length;

  fileContent =
    fileContent.slice(0, insertImportIndex) +
    "\n" +
    importStatement +
    fileContent.slice(insertImportIndex);

  const routesArrayEndIndex = fileContent.indexOf("];", fileContent.indexOf("const moduleRoutes"));

  if (routesArrayEndIndex === -1) {
    console.error("❌ moduleRoutes array not found!");
    return;
  }

  const routeEntry = `
  {
    path: "${routePath}",
    route: ${routeVar},
  },`;

  fileContent =
    fileContent.slice(0, routesArrayEndIndex) +
    routeEntry +
    "\n" +
    fileContent.slice(routesArrayEndIndex);

  fs.writeFileSync(ROUTES_INDEX_PATH, fileContent);
  console.log(`✅ Route registered: ${routePath}`);
};

// Main function to generate module
const generateModule = (moduleName) => {
  if (!moduleName) {
    console.error("❌ Please provide a module name!");
    process.exit(1);
  }

  const modulePath = path.join(MODULES_DIR, moduleName);
  if (fs.existsSync(modulePath)) {
    console.error(`❌ Module '${moduleName}' already exists!`);
    process.exit(1);
  }

  fs.mkdirSync(modulePath, { recursive: true });

  // Generate files from templates
  Object.entries(templates(moduleName)).forEach(([key, content]) => {
    const filePath = path.join(modulePath, `${moduleName}.${key}.ts`);
    fs.writeFileSync(filePath, content.trim());
    console.log(`✅ Created: ${filePath}`);
  });

  registerRoute(moduleName);

  console.log(`🎉 Module '${moduleName}' created successfully!`);
};

// Run script
const [, , moduleName] = process.argv;
generateModule(moduleName);
