'use client'

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


interface FormValues {
  title: string;
  description: string;
  photos: FileList | null;
}

const initialValues: FormValues = {
  title: '',
  description: '',
  photos: null,
};

const validationSchema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  photos: Yup.mixed().required('Required'),
});

const AdminForm: React.FC = () => {
  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    
    formData.append('title', values.title);
    formData.append('description', values.description);
    if (values.photos) {
      Array.from(values.photos).forEach((photo) => {
        formData.append('photos', photo);
      });
    }

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <Field id="title" name="title" className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" />
                <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <Field id="description" name="description" as="textarea" rows="10" className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="photos" className="block text-gray-700 text-sm font-bold mb-2">Photos</label>
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  multiple
                  onChange={(event) => {
                    setFieldValue('photos', event.currentTarget.files);
                  }}
                  className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage name="photos" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminForm;
