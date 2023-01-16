import { useField } from 'formik';
import styles from './customTextarea.module.scss';

const CustomTextarea = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label className={styles.label}>{label}</label>
      <textarea
        {...field}
        {...props}
        className={`styles.input ${
          meta.touched && meta.error ? 'styles.input-error' : ''
        }`}
      />
      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </>
  );
};
export default CustomTextarea;
