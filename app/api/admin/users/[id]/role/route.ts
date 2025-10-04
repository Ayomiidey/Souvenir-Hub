import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/admin/users/[id]/role
export async function PATCH(
  req: Request,
  { params }:  { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { role } = await req.json();
  console.log("PATCH /api/admin/users/[id]/role called", { id, role });
  if (!role) {
    console.log("No role provided");
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  try {
    // Find the role by name
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    console.log("Role record found:", roleRecord);
    if (!roleRecord) {
      console.log("Role not found in DB for name:", role);
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Remove all roles for the user (single role system)
    const deleted = await prisma.userRole.deleteMany({ where: { userId: id } });
    console.log("Deleted user roles:", deleted);
    // Assign the new role
    const created = await prisma.userRole.create({
      data: { userId: id, roleId: roleRecord.id },
    });
    console.log("Created user role:", created);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role", details: String(error) },
      { status: 500 }
    );
  }
}
