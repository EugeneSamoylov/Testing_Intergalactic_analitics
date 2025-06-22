import styles from './ButtonGenerate.module.css';

export const ButtonGenerate = ({ onClick }) => {
    return (
        <button className={styles.button} onClick={onClick}>
            <div className={styles.text}>
                Начать генерацию
            </div>
        </button>
    )
}