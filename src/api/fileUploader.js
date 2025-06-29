export const uploadFile = async (file, onDataReceived, onComplete, onError) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const url = new URL("http://localhost:3000/aggregate");
    url.searchParams.append("rows", 100000);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 204 || !response.body) {
      onComplete();
      return;
    }

    // Обработка потоковых данных
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let jsonBuffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Обработка буфера для извлечения JSON объектов
      let startIndex = 0;
      let braceCount = 0;
      let inString = false;

      for (let i = 0; i < buffer.length; i++) {
        const char = buffer[i];

        if (char === '"' && buffer[i - 1] !== "\\") {
          inString = !inString;
        } else if (!inString) {
          if (char === "{") {
            if (braceCount === 0) startIndex = i;
            braceCount++;
          } else if (char === "}") {
            braceCount--;
            if (braceCount === 0) {
              jsonBuffer = buffer.substring(startIndex, i + 1);

              try {
                const data = JSON.parse(jsonBuffer);
                onDataReceived(data);
              } catch (err) {
                console.error("JSON parse error", err, jsonBuffer);
              }

              // Очищаем обработанную часть буфера
              buffer = buffer.substring(i + 1);
              i = -1; // Сброс индекса после изменения буфера
            }
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error);
  }
};
