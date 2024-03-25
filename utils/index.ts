export async function readRequestBody(request) {
  try {
    const contentType = request.headers.get("content-type");
    if (contentType.includes("application/json")) {
      return await request.json();
    } else if (contentType.includes("application/text")) {
      return request.text();
    } else if (contentType.includes("text/html")) {
      return request.text();
    } else if (contentType.includes("form")) {
      const formData = await request.formData();
      const body = {};
      for (const entry of formData.entries()) {
        body[entry[0]] = entry[1];
      }
      return JSON.stringify(body);
    } else if (contentType.includes("image/jpeg")) {
      const formData = await request.formData();
      const photo = formData.get("photo");
      return photo.arrayBuffer((buffer) => {
        return buffer;
      });
    } else {
      console.log("contentType");
      console.log(contentType);
      // Perhaps some other type of data was submitted in the form
      // like an image, or some other binary data.
      return "a file";
    }
  } catch (e) {
    console.error(e);
    return e.message;
  }
}
