import { useState } from 'react';
import SectionHeading from './ui/SectionHeading';
import { useSiteContent } from '../context/SiteContentContext';
import api from '../services/api';

const EMPTY = { name: '', email: '', contact_number: '', subject: '', message: '', website: '' };

function contactDetails(org) {
    return [
        { icon: 'bi-geo-alt', label: 'Office Address', value: org.address },
        {
            icon: 'bi-telephone',
            label: 'Phone',
            value: [org.phone, org.mobile].filter(Boolean).join(' · '),
        },
        { icon: 'bi-envelope', label: 'Email', value: org.email },
        { icon: 'bi-clock', label: 'Office Hours', value: org.officeHours },
    ];
}

function validate(values) {
    const errors = {};
    if (!values.name.trim()) errors.name = 'Please enter your full name.';
    if (!values.email.trim()) {
        errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address.';
    }
    if (values.contact_number && !/^[0-9()+\-.\s]{5,30}$/.test(values.contact_number)) {
        errors.contact_number = 'Please enter a valid contact number.';
    }
    if (!values.subject.trim()) errors.subject = 'Please enter a subject.';
    if (!values.message.trim()) {
        errors.message = 'Please enter your message.';
    } else if (values.message.trim().length < 10) {
        errors.message = 'Please provide a little more detail (at least 10 characters).';
    }
    return errors;
}

export default function Contact() {
    const { organisation } = useSiteContent();
    const CONTACT_DETAILS = contactDetails(organisation);
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [feedback, setFeedback] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const clientErrors = validate(values);
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            setStatus('error');
            setFeedback('Please review the highlighted fields and try again.');
            return;
        }

        setStatus('submitting');
        setFeedback('');
        setErrors({});

        try {
            const { data } = await api.post('/contact', values);
            setStatus('success');
            setFeedback(data?.message || 'Thank you for reaching out. We will get back to you shortly.');
            setValues(EMPTY);
        } catch (err) {
            setStatus('error');
            setFeedback(err.message || 'Your message could not be sent. Please try again.');
            if (err.errors) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(err.errors).map(([key, messages]) => [key, messages[0]]),
                    ),
                );
            }
        }
    };

    const fieldClass = (name) => `form-control ${errors[name] ? 'is-invalid' : ''}`;

    return (
        <section id="contact" className="section section--surface" aria-labelledby="contact-title">
            <div className="container container-tight">
                <SectionHeading eyebrow="Contact" title="Get In Touch" id="contact-title">
                    Questions, feedback, or lost items — our passenger support team is here to help.
                </SectionHeading>

                <div className="row g-4 g-lg-5">
                    <div className="col-lg-5">
                        <div className="contact-panel h-100">
                            {CONTACT_DETAILS.map((detail) => (
                                <div className="contact-detail" key={detail.label}>
                                    <i className={`bi ${detail.icon}`} aria-hidden="true" />
                                    <div>
                                        <p className="label mb-1">{detail.label}</p>
                                        <p className="value mb-0">{detail.value}</p>
                                    </div>
                                </div>
                            ))}
                            <p className="text-muted small mt-3 mb-0">
                                Reach our passenger support team using the details above, or send us
                                a message with the form.
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <form className="contact-panel" onSubmit={handleSubmit} noValidate>
                            {status === 'success' && (
                                <div
                                    className="form-alert alert alert-success"
                                    role="status"
                                    aria-live="polite"
                                >
                                    <i className="bi bi-check-circle-fill me-2" aria-hidden="true" />
                                    {feedback}
                                </div>
                            )}
                            {status === 'error' && feedback && (
                                <div
                                    className="form-alert alert alert-danger"
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    <i
                                        className="bi bi-exclamation-triangle-fill me-2"
                                        aria-hidden="true"
                                    />
                                    {feedback}
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="c-name" className="form-label">
                                        Full Name <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="c-name"
                                        name="name"
                                        type="text"
                                        className={fieldClass('name')}
                                        value={values.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        required
                                        aria-describedby={errors.name ? 'c-name-error' : undefined}
                                    />
                                    {errors.name && (
                                        <div id="c-name-error" className="invalid-feedback d-block">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="c-email" className="form-label">
                                        Email Address <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="c-email"
                                        name="email"
                                        type="email"
                                        className={fieldClass('email')}
                                        value={values.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                        aria-describedby={errors.email ? 'c-email-error' : undefined}
                                    />
                                    {errors.email && (
                                        <div id="c-email-error" className="invalid-feedback d-block">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="c-phone" className="form-label">
                                        Contact Number
                                    </label>
                                    <input
                                        id="c-phone"
                                        name="contact_number"
                                        type="tel"
                                        className={fieldClass('contact_number')}
                                        value={values.contact_number}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                        aria-describedby={
                                            errors.contact_number ? 'c-phone-error' : undefined
                                        }
                                    />
                                    {errors.contact_number && (
                                        <div id="c-phone-error" className="invalid-feedback d-block">
                                            {errors.contact_number}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="c-subject" className="form-label">
                                        Subject <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="c-subject"
                                        name="subject"
                                        type="text"
                                        className={fieldClass('subject')}
                                        value={values.subject}
                                        onChange={handleChange}
                                        required
                                        aria-describedby={
                                            errors.subject ? 'c-subject-error' : undefined
                                        }
                                    />
                                    {errors.subject && (
                                        <div
                                            id="c-subject-error"
                                            className="invalid-feedback d-block"
                                        >
                                            {errors.subject}
                                        </div>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label htmlFor="c-message" className="form-label">
                                        Message <span aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id="c-message"
                                        name="message"
                                        rows="5"
                                        className={fieldClass('message')}
                                        value={values.message}
                                        onChange={handleChange}
                                        required
                                        aria-describedby={
                                            errors.message ? 'c-message-error' : undefined
                                        }
                                    />
                                    {errors.message && (
                                        <div
                                            id="c-message-error"
                                            className="invalid-feedback d-block"
                                        >
                                            {errors.message}
                                        </div>
                                    )}
                                </div>

                                {/* Honeypot — hidden from real users */}
                                <div className="form-hp" aria-hidden="true">
                                    <label htmlFor="c-website">Leave this field empty</label>
                                    <input
                                        id="c-website"
                                        name="website"
                                        type="text"
                                        tabIndex="-1"
                                        autoComplete="off"
                                        value={values.website}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={status === 'submitting'}
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    aria-hidden="true"
                                                />
                                                Sending…
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
