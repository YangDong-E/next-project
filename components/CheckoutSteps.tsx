export const CheckoutSteps = ({ current = 0 }) => {
    return (
        <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
            {['로그인', '배송지 입력', '결제수단', '주문하기'].map(
                (step, index) => (
                    <li
                        key={step}
                        className={`step
            ${index <= current ? 'step-primary' : ''}
            `}
                    >
                        {step}
                    </li>
                )
            )}
        </ul>
    )
}
