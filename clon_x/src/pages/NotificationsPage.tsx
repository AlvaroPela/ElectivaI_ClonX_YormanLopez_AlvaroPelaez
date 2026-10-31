export const NotificationsPage = () => {

    return (

        <>
        <section className="py-5">
	    <div className="container">
		<div className="row justify-content-center text-center mb-2 mb-lg-4">
			<div className="col-lg-8 col-xxl-7">
				<span className="text-muted">Let's Talk</span>
				<h2 className="display-5 fw-bold mb-3">Request a Callback</h2>
				<p className="lead">Lorem ipsum dolor, sit amet elit Quamnitm veniam dicta, quos nemo minima nulla ducimus officii nulla ducimus officiis! Lorem ipsum dolor, sit amet elit Quamnitm.</p>
			</div>
		</div>
		<div className="row justify-content-center">
			<div className="col-md-8">
				<form>
					<div className="row">
						<div className="col-md-4">
							<div className="mb-4">
								<input className="form-control bg-light" placeholder="Your name" type="text" />
							</div>
						</div>
						<div className="col-md-4">
							<div className="mb-4">
								<input className="form-control bg-light" placeholder="Your phone number" type="text" />
							</div>
						</div>
						<div className="col-md-4">
							<div className="d-grid">
								<button className="btn btn-primary" type="submit">Submit</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
        </>
    )
}