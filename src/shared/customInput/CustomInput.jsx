import { useField } from 'formik';
import styles from './customInput.module.scss';

const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label className={styles.label}>{label}</label>
      <input
        {...field}
        {...props}
        className={`styles.input ${
          meta.touched && meta.error ? 'styles.input-error' : ''
        }`}
        autoComplete="off"
      />
      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </>
  );
};
export default CustomInput;
