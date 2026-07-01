exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  const IMGBB_KEY = process.env.IMGBB_KEY;
  if (!IMGBB_KEY) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Server not configured (missing IMGBB_KEY)' }) };
  }

  let image;
  try {
    ({ image } = JSON.parse(event.body || '{}'));
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid request body' }) };
  }

  if (!image) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'No image provided' }) };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('image', image);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data && data.success) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, url: data.data.url })
      };
    }

    return {
      statusCode: 502,
      body: JSON.stringify({ success: false, error: 'ImgBB upload failed' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Upload error' })
    };
  }
};
