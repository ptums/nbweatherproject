import { User } from "@prisma/client";
import { UserRepository } from "../../repository";

export async function createUser(
  userData: Omit<User, "id">
): Promise<User | null> {
  try {
    return await UserRepository.create(userData);
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function findUserById(id: number): Promise<User | null> {
  try {
    return await UserRepository.findById(id);
  } catch (error) {
    console.error(`Error finding user with id ${id}:`, error);
    return null;
  }
}

// findByUniqueId

export async function findUserByUniqueId(
  uniqueId: string
): Promise<User | null> {
  try {
    return await UserRepository.findByUniqueId(uniqueId);
  } catch (error) {
    console.error(`Error finding user with id ${uniqueId}:`, error);
    return null;
  }
}

export async function deleteUser(id: number): Promise<boolean> {
  try {
    await UserRepository.deleteById(id);
    return true;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return false;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    return await UserRepository.findAll();
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function updateUser(
  id: number,
  userData: Partial<Omit<User, "id">>
): Promise<User | null> {
  try {
    return await UserRepository.update(id, userData);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return null;
  }
}

export async function userExists(id: number): Promise<boolean> {
  try {
    return await UserRepository.existsById(id);
  } catch (error) {
    console.error(`Error checking existence of user ${id}:`, error);
    return false;
  }
}
