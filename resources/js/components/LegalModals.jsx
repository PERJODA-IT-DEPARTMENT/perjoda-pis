/**
 * Lightweight Privacy Policy / Terms of Use modals so the footer links
 * are functional rather than dead. Placeholder copy — replace with the
 * official policies when available.
 */
function Modal({ id, title, children }) {
    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            aria-labelledby={`${id}-label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title h5" id={`${id}-label`}>
                            {title}
                        </h2>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LegalModals() {
    return (
        <>
            <Modal id="privacyModal" title="Privacy Policy">
                <p className="text-muted small">
                    This is placeholder text and does not constitute PERJODA's official privacy
                    policy.
                </p>
                <p>
                    PERJODA Transport Cooperative respects your privacy. Information submitted
                    through the contact form —
                    such as your name, email address, contact number, and message — is used only to
                    respond to your enquiry and to improve passenger services.
                </p>
                <p>
                    We do not sell your personal information. Data is stored securely and retained
                    only for as long as needed to address your concern or as required by applicable
                    law.
                </p>
                <p className="mb-0">
                    For questions about how your information is handled, please contact us using the
                    details in the Contact section.
                </p>
            </Modal>

            <Modal id="termsModal" title="Terms of Use">
                <p className="text-muted small">
                    This is placeholder text and does not constitute PERJODA's official terms of
                    use.
                </p>
                <p>
                    The information on this website is provided for general guidance about PERJODA
                    Transport Cooperative's transportation services. Routes, fares, schedules, and
                    announcements may change without prior notice.
                </p>
                <p>
                    While we work to keep this information accurate and up to date, it should not be
                    treated as a guarantee of service. Please confirm details with PERJODA staff
                    where needed.
                </p>
                <p className="mb-0">
                    By using this website, you agree to use the information responsibly and in good
                    faith.
                </p>
            </Modal>
        </>
    );
}
