import { prisma } from "@/lib/prisma";

async function createAdmin() {
  try {
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";
    const adminName = "Admin User";
    const adminPhone = "1234567890";

    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      console.log("Admin user already exists:", existing.email);
      return existing;
    }

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        phoneNumber: adminPhone,
        password: adminPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created:", admin.email);
    return admin;
  } catch (error) {
    console.log("Error creating admin user:", error);
    return null;
  }
}

createAdmin();
