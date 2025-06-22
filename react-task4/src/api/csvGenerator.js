export const generateCSV = async (
  size = 0.1,
  withErrors = "off",
  maxSpend = "1000"
) => {
  try {
    const url = new URL("http://localhost:3000/report");
    url.searchParams.append("size", size);
    url.searchParams.append("withErrors", withErrors);
    url.searchParams.append("maxSpend", maxSpend);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/csv",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка генерации отчета");
    }

    return response;
  } catch (error) {
    console.error("Ошибка при генерации CSV:", error);
    throw error;
  }
};
