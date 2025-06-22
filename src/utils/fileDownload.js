export const downloadFile = (blob, filename) => {
  // Создаем временную ссылку для скачивания
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Очищаем ресурсы
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Ошибка при скачивании файла:", error);
    throw error;
  }
};
