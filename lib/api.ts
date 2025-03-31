/**
 * API модуль для взаимодействия с данными семинаров
 * Содержит базовые CRUD операции для работы с семинарами
 */

// Определение типа для семинара
export interface Seminar {
  id: number          // Уникальный идентификатор
  title: string       // Название семинара
  description: string // Описание
  date: string        // Дата проведения (формат зависит от бэкенда)
  time: string        // Время проведения
  photo: string       // URL фотографии/изображения семинара
}

/**
 * Получает список всех семинаров с сервера
 * @returns Promise с массивом семинаров
 * @throws Ошибку при неудачном запросе
 */
export async function fetchSeminars(): Promise<Seminar[]> {
  try {
    // Отправляем GET запрос к API
    const response = await fetch("/api/seminars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Указываем тип контента
      },
      cache: "no-store", // Отключаем кэширование для актуальных данных
    })

    // Проверяем статус ответа
    if (!response.ok) {
      throw new Error(`Error fetching seminars: ${response.status}`)
    }

    // Парсим и возвращаем JSON данные
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch seminars:", error)
    throw error // Пробрасываем ошибку для обработки в компоненте
  }
}

/**
 * Удаляет семинар по ID
 * @param id - ID семинара для удаления
 * @throws Ошибку при неудачном запросе
 */
export async function deleteSeminar(id: number): Promise<void> {
  try {
    // Отправляем DELETE запрос с указанием ID
    const response = await fetch(`/api/seminars/${id}`, {
      method: "DELETE",
    })

    // Проверяем успешность операции
    if (!response.ok) {
      throw new Error(`Error deleting seminar: ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to delete seminar with ID ${id}:`, error)
    throw error
  }
}

/**
 * Обновляет данные семинара
 * @param seminar - Объект семинара с обновленными данными
 * @returns Promise с обновленным семинаром
 * @throws Ошибку при неудачном запросе
 */
export async function updateSeminar(seminar: Seminar): Promise<Seminar> {
  try {
    // Отправляем PUT запрос с обновленными данными
    const response = await fetch(`/api/seminars/${seminar.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seminar), // Сериализуем объект в JSON
    })

    if (!response.ok) {
      throw new Error(`Error updating seminar: ${response.status}`)
    }

    // Возвращаем обновленные данные с сервера
    return await response.json()
  } catch (error) {
    console.error(`Failed to update seminar with ID ${seminar.id}:`, error)
    throw error
  }
}