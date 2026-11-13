import preview from "@storybook/preview";

import CourseEnrollmentForm from "./CourseEnrollmentForm.astro";

const meta = preview.meta({
  title: "Components/Actions/CourseEnrollmentForm",
  component: CourseEnrollmentForm,
  tags: ["autodocs", "version:0.1.0", "new", "alpha"],
  args: {
    courseTitle: "Introducción al Árabe Coránico",
    strapiBaseUrl: "http://localhost:1337",
  },
});

export const Default = meta.story({});
