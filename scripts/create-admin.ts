import "dotenv/config"
import { db } from "../lib/db"
import { hashPassword } from "../lib/auth/password"
import { Role } from "@/lib/generated/prisma/enums"

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env")
    process.exit(1)
  }

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters")
    process.exit(1)
  }

  const normalizedEmail = email.trim().toLowerCase()
  const existing = await db.adminUser.findUnique({
    where: { email: normalizedEmail },
  })

  if (existing) {
    await db.adminUser.update({
      where: { id: existing.id },
      data: { active: true, role: Role.OWNER },
    })
    console.log(
      `admin ${normalizedEmail} already exists — ensured role=OWNER and active`
    )
    return
  }

  const passwordHash = await hashPassword(password)
  await db.adminUser.create({
    data: {
      email: normalizedEmail,
      name: normalizedEmail.split("@")[0] ?? "owner",
      passwordHash,
      role: Role.OWNER,
    },
  })
  console.log(`created OWNER admin ${normalizedEmail}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
