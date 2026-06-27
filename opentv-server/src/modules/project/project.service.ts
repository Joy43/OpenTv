import status from 'http-status';

import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { Project } from '@prisma/client';

const createProject=async(payload:Project)=>{
    const result = await prisma.project.create({
  data: {
    title: payload.title,
    description: payload.description,
  
    image: payload.image,
    tvurl: payload.tvurl,
     
 
    user: {
      connect: { id: payload.userId }
    }
  }
});

  return result;

};
// ------------get all category---------------
const getAllproject = async (paginateQuery: Record<string, unknown>) => {
  const { page = 1, limit = 10 } = paginateQuery;
  const skip = (Number(page) - 1) * Number(limit);
  console.log({ page, limit, skip });
  const result = await prisma.project.findMany({
    take: Number(limit),
    skip,
    orderBy: {
      createdAt: "desc",
    },
    include: {
   
      user: true,
    },
  });
  return {
    data: result,
    meta: {
      total: await prisma.project.count({}),
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil((await prisma.project.count({})) / Number(limit)),
    },
  };
};
  // ----------update --------------
  const Updateproject=async(projectId:string,payload:Partial<Project>)=>{

    const result=await prisma.project.update({
      where: { id: projectId },
        data: payload
    });
    return result;
   
   };
  
  // --------delete bike-----------
  const DeleteProject=async(projectId:string)=>{
    const result=await prisma.project.delete({
      where:{id: projectId}
    });
    return result;
  
  };
// ------------single project----------
  const getSingleProject = async (id: string) => {
  const result = await prisma.project.findUnique({
    where: {
      id,
    
    },
    
    include: {
    
      user: true,
    },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "PoJECT not found");
  }
  return result;
};
export const projectService={
    createProject,
    getAllproject,
    Updateproject,
    DeleteProject,
    getSingleProject

}