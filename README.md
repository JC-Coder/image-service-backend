# Image Service API

## Overview

The Image Service API is a robust and scalable solution designed to facilitate the uploading, sharing, and monitoring of images. Built on the NestJS framework, this TypeScript-based application offers a comprehensive set of features that cater to the needs of modern web applications requiring efficient image management. Whether you're developing a social media platform, an e-commerce site, or any application that involves user-generated content, this API provides the essential functionalities to handle images securely and efficiently.

## Features

- **User Authentication**: Secure user authentication using JWT tokens to ensure that image uploads and deletions are performed by authorized users.
- **Image Upload**: Users can upload images with support for various file types and sizes. The API includes file validation to ensure security and integrity.
- **Image Sharing**: Users can share images with others, with support for generating public paths for easy access.
- **Image Monitoring**: Track views and interactions with images, allowing for analytics on how images are being used and accessed.
- **Private and Public Access**: Images can be marked as private or public, controlling access based on user authentication.
- **Efficient Storage Management**: Images are stored efficiently on the server with options for custom storage paths and filename generation to prevent conflicts and ensure organization.
- **Scalable Architecture**: Built on NestJS, the API is designed for scalability, making it suitable for applications with high demands for image processing and storage.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- A PostgreSQL database
- Any REST client (e.g., Postman) for testing endpoints

### Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/image-service-backend.git
cd image-service-backend
```

2. Install the necessary dependencies:

```bash
npm install
```

3. Configure your environment variables:

Create a `.env` file in the root directory and populate it with the necessary environment variables, such as database connection details and JWT secret key.

4. Run the application in development mode:

```bash
npm run start:dev
```

The server should start, and you can begin making requests to `http://localhost:3000/`.

### Usage

#### User Authentication

- **Register**: Endpoint to register a new user.
- **Login**: Endpoint for user login. Returns a JWT token for authenticated requests.

#### Image Management

- **Upload Image**: Authenticated users can upload images. The request must include the image file and any relevant metadata.
- **Get All Images**: Retrieve a list of all images. Can be filtered by user.
- **Get Image**: Fetch a specific image by its private or public path.
- **Delete Image**: Authenticated users can delete their images.

## Deployment

For production environments, build the application using:

```bash
npm run build
```

And then start the production server:

```bash
npm run start:prod
```

Ensure that your production environment variables are properly configured.

## Support

This project is open-source and licensed under the MIT License. Contributions, issues, and feature requests are welcome.

## Contact

For any inquiries or further assistance, please contact the project maintainer:

- **JC CODER**
- Official Website: [https://jc-coder.vercel.app](https://jc-coder.vercel.app)
- Twitter: [@jc_coder1](https://twitter.com/jc_coder1)

---

This README provides a comprehensive guide to getting started with and using the Image Service API. For any additional information or clarification, please refer to the source code or contact the maintainer.